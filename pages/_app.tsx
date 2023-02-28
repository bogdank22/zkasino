import "../styles/globals.css";
import type { AppProps } from "next/app";

import { WagmiConfig, createClient } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bscTestnet } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import Header from "../components/header/header";

const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    //infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [bscTestnet, mainnet, polygon, optimism, arbitrum],
  })
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <div className="bg-radial-gradient relative h-[100vh] w-full">
          <Header />
          <Component {...pageProps} />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
