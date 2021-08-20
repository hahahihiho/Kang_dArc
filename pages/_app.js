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
        <Link href="/">
          <a className="text-4xl font-bold hover:text-green-300">Kang d'Arc</a>
        </Link>
        <div className="mt-4">
          <Link href="/create-item">
            <a className="mr-6 text-pink-500 hover:underline">
              Create NFT
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