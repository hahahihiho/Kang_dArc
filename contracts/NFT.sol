// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Travel", "T") {
        contractAddress = marketplaceAddress;
    }


    function getAll() public view returns (address[] memory){
        uint total_count = _tokenIds.current();
        address[] memory ret = new address[](total_count+1);
        for (uint i = 0; i <= total_count; i++) {
            if(_exists(i)){
                ret[i] = ownerOf(i);
            }
        }
        return ret;
    }

    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        approve(contractAddress, newItemId);
        return newItemId;
    }
}