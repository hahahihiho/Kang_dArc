import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import Image from 'next/image'
import Link from 'next/link'

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [signerAddress, setSignerAddress] = useState('');
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signer_address = await signer.getAddress()
    setSignerAddress(signer_address)

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await tokenContract.getAll();
    console.log(data);

    const items = await Promise.all(data.map(async (d,i) => {
      let item = null;
      if(parseInt(d)!=0){
        const tokenUri = await tokenContract.tokenURI(i)
        const meta = await axios.get(tokenUri)
        item = {
          tokenId: i,
          owner: d,
          name: meta.data.name,
          description: meta.data.description,
          image: meta.data.image
        }
      }
      return item
    }))

    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">All Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {
          nfts.map((nft, i) => {
            if(nft!=null){
              return (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <div style={{position:'absolute'}} className="rounded-full bg-opacity-70 bg-yellow-300 ml-1 mt-1" >{nft.tokenId}</div>
                <img src={nft.image} className="rounded" />
                <div className="p-4">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
              </div>
              )
            }
          })
        }
        </div>
      </div>
    </div>
  )
}