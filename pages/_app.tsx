import type { AppProps } from 'next/app'
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { bscTestnet } from 'wagmi/chains'
import '@/styles/globals.css'

const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    // alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID,
    //infuraId: process.env.INFURA_ID,
    chains: [bscTestnet],
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
