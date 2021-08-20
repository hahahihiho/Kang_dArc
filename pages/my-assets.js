import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import Image from 'next/image';
import Link from 'next/link';

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
// import * as d3 from 'd3';
// const d3 = require('d3')
// const topojson = require('topojson-client')
// import * as topojson from 'topojson-client';

export default function MyAssets() {
  const [signerAddress, setSignerAddress] = useState('');
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs();
    loadMap();
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
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    const data = await tokenContract.getAll();
    
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
  function loadMap(){

    var width = window.innerWidth*0.4,
    height = window.innerHeight*0.4

    const DefaultColor="#b8b8b8";

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "map");

    var projection = d3.geoMercator()
        .translate([width / 2.2, height / 1.5]);

    var path = d3.geoPath()
        .projection(projection);

    queue()
        .defer(d3.json, "https://unpkg.com/world-atlas@1/world/110m.json" )
        .await(ready);

    function ready(error, data){
        console.log(data)
        var features = topojson.feature(data, data.objects.countries).features;

        svg.selectAll("path")
            .data(features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", DefaultColor)
            
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )

    }
    const mouseOver = function(d) {
        // d3.select(this).style("stroke","black");
        this.style.stroke = "black"
        this.style.fill = "orange"
        console.dir(this);
    }
    const mouseLeave = function(d){
        d3.select(this)
            .style("stroke",DefaultColor)
            .style("fill",DefaultColor);
    }
  }
  console.log(nfts)
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <>
      <div id="map" className="w-1/2 h-1/2 lm-5"></div>
      <div className="p-4">
        <h2 className="text-2xl py-2">My Items</h2>
          <div className="grid grid-cols-10 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => {
              if(nft!=null && nft.owner == signerAddress){
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
                  <div>
                    <a className="w-full bg-pink-500 text-white font-bold py-0.5 px-10 rounded">
                      <Link href={{ pathname:"/sell-token", query: {tokenId : nft.tokenId} }}>Sell </Link>
                    </a>
                  </div>
                </div>
                )
              }
            })
          }
        </div>
      </div>
    </>
  )
}