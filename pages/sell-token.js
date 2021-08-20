import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

import Image from 'next/image'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import Router from 'next/dist/next-server/server/router'

export default function SellItem() {
  const [formInput, updateFormInput] = useState({ tokenId: '', price: ''})
  const router = useRouter()
  useEffect(()=>{
    updateFormInput({...formInput,tokenId:router.query.tokenId})
  },[])

  async function createMarket() {
    const { tokenId, price } = formInput
    console.log(tokenId,price);
    if (isNaN(parseInt(tokenId)) || isNaN(parseInt(price)) ) {
      console.log(`Wrong Input :${tokenId} ${price}`);
      return
    }
    try {
      sellToken(parseInt(tokenId))
    } catch (error) {
      console.log('Error selling: ', error)
    }  
  }

  async function sellToken(tokenId) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    
    /* then list the item for sale on the marketplace */
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await marketContract.getListingPrice()
    listingPrice = listingPrice.toString()
    
    console.log(nftmarketaddress,tokenId)
    let approved_address = await tokenContract.getApproved(tokenId);
    let transaction;
    let tx;
    if(approved_address != nftmarketaddress){
      transaction = await tokenContract.approve(nftmarketaddress,tokenId)
      tx = await transaction.wait()
    }
    transaction = await marketContract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    tx = await transaction.wait()
    console.log(tx);
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset ID"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, tokenId: e.target.value })}
          value={formInput.tokenId||""}
        />
        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Sell Digital Asset
        </button>
      </div>
    </div>
  )
}