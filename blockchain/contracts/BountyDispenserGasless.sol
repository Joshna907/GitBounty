// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./GitBountyBadge.sol";

contract BountyDispenserGasless is ReentrancyGuard {

    struct Claim {
        address claimant;
        string proofLink;
        bool approved;
    }

    struct Bounty {
        uint256 id;
        address creator;
        uint256 rewardAmount; // ETH locked for bounty
        string githubIssueUrl;
        bool isOpen;
        string badgeURI;
        address winner; // Winner address stored
    }

    mapping(uint256 => Bounty) public bounties;
    mapping(uint256 => Claim[]) private bountyClaims;

    uint256 public nextBountyId = 1;
    GitBountyBadge public badgeNFT;

    // Events
    event BountyCreated(uint256 indexed id, address indexed creator, uint256 reward);
    event ProofSubmitted(uint256 indexed id, address indexed developer, string proof);
    event BountyApproved(uint256 indexed id, address indexed developer, uint256 reward, string message);
    event BountyRejected(uint256 indexed id, address indexed developer, string message);
    event BountyClosed(uint256 indexed id, string message);

    modifier onlyCreator(uint256 _id) {
        require(bounties[_id].creator != address(0), "Bounty not found");
        require(msg.sender == bounties[_id].creator, "Only creator allowed");
        _;
    }

    constructor(address badgeAddress) {
        require(badgeAddress != address(0), "Badge contract required");
        badgeNFT = GitBountyBadge(badgeAddress);
    }

    // ✅ Create bounty with ETH deposit
    function createBounty(string calldata issueUrl, string calldata _badgeURI)
        external
        payable
        returns (uint256)
    {
        require(msg.value > 0, "Deposit ETH reward");
        require(bytes(issueUrl).length > 0, "Issue URL required");
        require(bytes(_badgeURI).length > 0, "Badge URI required");

        uint256 id = nextBountyId;
        Bounty storage b = bounties[id];

        b.id = id;
        b.creator = msg.sender;
        b.rewardAmount = msg.value;
        b.githubIssueUrl = issueUrl;
        b.isOpen = true;
        b.badgeURI = _badgeURI;
        b.winner = address(0); // default no winner

        emit BountyCreated(id, msg.sender, msg.value);
        nextBountyId++;
        return id;
    }

    // ✅ Submit or update proof for bounty
    function claimBounty(uint256 _id, string calldata _proof) external {
        Bounty storage b = bounties[_id];
        require(b.creator != address(0), "Bounty not found");
        require(b.isOpen, "Bounty closed");
        require(msg.sender != b.creator, "Creator cannot claim own bounty");
        require(bytes(_proof).length > 0, "Proof required");
        require(b.rewardAmount > 0, "No reward locked");

        Claim[] storage claims = bountyClaims[_id];

        // Update existing pending claim if present
        for (uint i = 0; i < claims.length; i++) {
            if (claims[i].claimant == msg.sender && !claims[i].approved) {
                claims[i].proofLink = _proof;
                emit ProofSubmitted(_id, msg.sender, _proof);
                return;
            }
        }

        // Create new claim if no pending claim exists
        claims.push(Claim({
            claimant: msg.sender,
            proofLink: _proof,
            approved: false
        }));

        emit ProofSubmitted(_id, msg.sender, _proof);
    }

    // ✅ Creator approves or rejects claim
    function handleClaim(
        uint256 _id,
        address claimant,
        bool approve,
        string calldata msgForDev
    ) external onlyCreator(_id) nonReentrant {

        Bounty storage b = bounties[_id];
        Claim[] storage claims = bountyClaims[_id];
        require(b.rewardAmount > 0, "No ETH locked");
        require(b.isOpen, "Bounty already closed");

        bool found = false;

        for (uint i = 0; i < claims.length; i++) {
            if (claims[i].claimant == claimant && !claims[i].approved) {
                found = true;
                Claim storage c = claims[i];

                if (approve) {
                    uint256 reward = b.rewardAmount;
                    b.rewardAmount = 0;
                    c.approved = true;
                    b.isOpen = false;
                    b.winner = claimant; // store winner

                    (bool sent, ) = payable(claimant).call{value: reward}("");
                    require(sent, "ETH transfer failed");

                    badgeNFT.mintBadge(claimant, b.badgeURI);

                    emit BountyApproved(_id, claimant, reward, msgForDev);
                } else {
                    // Reject claim (swap+pop)
                    claims[i] = claims[claims.length - 1];
                    claims.pop();
                    emit BountyRejected(_id, claimant, msgForDev);
                }

                break;
            }
        }

        require(found, "Pending claim not found");
    }

    // ✅ Close bounty and refund ETH
    function closeBounty(uint256 _id) external onlyCreator(_id) nonReentrant {
        Bounty storage b = bounties[_id];
        require(b.isOpen, "Already closed");
        require(b.rewardAmount > 0, "No ETH to refund");

        uint256 refund = b.rewardAmount;
        b.rewardAmount = 0;
        b.isOpen = false;

        (bool refunded, ) = payable(msg.sender).call{value: refund}("");
        require(refunded, "Refund failed");

        emit BountyClosed(_id, "Closed by creator, ETH refunded");
    }

    // ✅ Get bounty details including all claims and winner
    function getBountyWithClaims(uint256 _id)
        external
        view
        returns (
            uint256 id,
            address creator,
            uint256 reward,
            string memory issueUrl,
            bool open,
            string memory badgeURI,
            address winner,
            Claim[] memory allClaims
        )
    {
        Bounty storage b = bounties[_id];

        Claim[] storage claims = bountyClaims[_id];
        Claim[] memory memClaims = new Claim[](claims.length);

        for (uint i = 0; i < claims.length; i++) {
            memClaims[i] = claims[i];
        }

        return (b.id, b.creator, b.rewardAmount, b.githubIssueUrl, b.isOpen, b.badgeURI, b.winner, memClaims);
    }

    function getClaims(uint256 id) external view returns (Claim[] memory) {
         return bountyClaims[id]; 
    }

    receive() external payable {}
}
