// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./GitBountyBadge.sol";

contract BountyDispenserGasless is ERC2771Context {
    struct Bounty {
        uint256 id;
        address creator;
        uint256 rewardAmount;
        string githubIssueUrl;
        bool isOpen;
        address winner;
        bool isTokenReward;
        string badgeURI; 
    }

    mapping(uint256 => Bounty) public bounties;
    uint256 public nextBountyId = 1;

    IERC20 public rewardToken;
    GitBountyBadge public badgeNFT;
    address public admin;

    event BountyCreated(uint256 id, address creator, uint256 reward, bool isToken, string issueUrl, string badgeURI);
    event WinnerSet(uint256 id, address winner);
    event BountyClaimed(uint256 id, address winner, uint256 reward);
    event BountyClosed(uint256 id, address closedBy);
    event AdminChanged(address oldAdmin, address newAdmin);

    constructor(address _trustedForwarder, address _token, address _badges, address _admin)
        ERC2771Context(_trustedForwarder)
    {
        admin = _admin;
        rewardToken = IERC20(_token);
        badgeNFT = GitBountyBadge(_badges);
    }

    modifier onlyAdmin() {
        require(_msgSender() == admin, "Not authorized: admin only");
        _;
    }

    // Admin transfer
    function setAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        emit AdminChanged(admin, _newAdmin);
        admin = _newAdmin;
    }

    // ✅ Create a new bounty (now includes badge URI)
   function createBounty(
    string memory _issueUrl,
    uint256 _tokenAmount,
    bool _isToken,
    string memory _badgeURI
) external payable {
    if (_isToken) {
        require(_tokenAmount > 0, "Token amount must be > 0");
        
        // ✅ Check if creator has enough tokens
        uint256 creatorBalance = rewardToken.balanceOf(_msgSender());
        require(creatorBalance >= _tokenAmount, "Insufficient token balance to create bounty");
        
        // ✅ Check allowance
        uint256 allowance = rewardToken.allowance(_msgSender(), address(this));
        require(allowance >= _tokenAmount, "Approve tokens before creating bounty");

        // ✅ Transfer tokens from creator to contract
        rewardToken.transferFrom(_msgSender(), address(this), _tokenAmount);
    } else {
        require(msg.value > 0, "ETH reward must be > 0");
    }

    bounties[nextBountyId] = Bounty({
        id: nextBountyId,
        creator: _msgSender(),
        rewardAmount: _isToken ? _tokenAmount : msg.value,
        githubIssueUrl: _issueUrl,
        isOpen: true,
        winner: address(0),
        isTokenReward: _isToken,
        badgeURI: _badgeURI
    });

    emit BountyCreated(nextBountyId, _msgSender(), _isToken ? _tokenAmount : msg.value, _isToken, _issueUrl, _badgeURI);
    nextBountyId++;
}


    // Set bounty winner (by admin or bounty creator)
    function setWinner(uint256 _id, address _winner) external {
        Bounty storage bounty = bounties[_id];
        require(bounty.isOpen, "Already closed");
        require(_msgSender() == bounty.creator, "Only creator set winner");
        bounty.winner = _winner;
        emit WinnerSet(_id, _winner);
    }

    // ✅ Winner claims bounty (no need to provide badge URI)
    function claimBounty(uint256 _id) external {
        Bounty storage bounty = bounties[_id];
        require(bounty.isOpen, "Bounty closed");
        require(_msgSender() == bounty.winner, "Not authorized: not winner");

        bounty.isOpen = false;

        if (bounty.isTokenReward) {
            rewardToken.transfer(_msgSender(), bounty.rewardAmount);
        } else {
            (bool success, ) = payable(_msgSender()).call{value: bounty.rewardAmount}("");
            require(success, "ETH transfer failed");
        }

        // ✅ Use stored URI from bounty
        badgeNFT.mintBadge(_msgSender(), bounty.badgeURI);

        emit BountyClaimed(_id, _msgSender(), bounty.rewardAmount);
    }

    // Creator or Admin can close bounty and refund reward
    function closeBounty(uint256 _id) external {
        Bounty storage bounty = bounties[_id];
        require(bounty.isOpen, "Already closed");
        require(_msgSender() == bounty.creator, "Only creator Close Bounty");
        require(bounty.winner == address(0), "Cannot close: winner already set");

        bounty.isOpen = false;

        if (bounty.isTokenReward) {
            rewardToken.transfer(bounty.creator, bounty.rewardAmount);
        } else {
            (bool success, ) = payable(bounty.creator).call{value: bounty.rewardAmount}("");
            require(success, "Refund failed");
        }

        emit BountyClosed(_id, _msgSender());
    }

    // Get full bounty details
    function getBounty(uint256 _id)
        external
        view
        returns (
            uint256 id,
            address creator,
            uint256 rewardAmount,
            string memory githubIssueUrl,
            bool isOpen,
            address winner,
            bool isTokenReward,
            string memory badgeURI
        )
    {
        Bounty memory b = bounties[_id];
        return (b.id, b.creator, b.rewardAmount, b.githubIssueUrl, b.isOpen, b.winner, b.isTokenReward, b.badgeURI);
    }

    // Meta TX overrides
    function _msgSender() internal view override(ERC2771Context) returns (address) {
        return ERC2771Context._msgSender();
    }

    function _msgData() internal view override(ERC2771Context) returns (bytes calldata) {
        return ERC2771Context._msgData();
    }

    receive() external payable {}
}
