// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GitBountyBadge is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    constructor() ERC721("GitBounty Badges", "GBB") Ownable(msg.sender) {}

    event BadgeMinted(uint256 indexed tokenId, address indexed recipient, string uri);

    function mintBadge(address recipient, string calldata uri)
        external
        onlyOwner
        returns (uint256)
    {
        require(recipient != address(0), "Invalid wallet address");
        require(bytes(uri).length > 0, "URI cannot be empty");

        uint256 tokenId = _nextTokenId;
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, uri);
        _nextTokenId++;

        emit BadgeMinted(tokenId, recipient, uri);
        return tokenId;
    }

    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }
}
