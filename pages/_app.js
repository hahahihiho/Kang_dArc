import '../styles/globals.css'
import Link from 'next/link'
import Head from 'next/head'

function Marketplace({ Component, pageProps }) {
  return (
    <>
    <Head>
      <script src="https://d3js.org/d3.v4.min.js"></script>
      <script src="https://unpkg.com/topojson-client@3"></script>
      <script src="https://d3js.org/queue.v1.min.js"></script>
    </Head>
    <div>
      <nav className="border-b p-6 flex justify-between">
        <div className="text-4xl font-bold">Kang d'Arc</div>
        <div className="mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500 hover:underline">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500 hover:underline">
              Create NFT
            </a>
          </Link>
          <Link href="/sell-token">
            <a className="mr-6 text-pink-500 hover:underline">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500 hover:underline">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500 hover:underline">
              Creator Dashboard
            </a>
          </Link>
          <Link href="/all-token">
            <a className="mr-6 text-pink-500 hover:underline">
              All Token
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
      <footer></footer>
    </div>
    </>
  )
}

export default Marketplace