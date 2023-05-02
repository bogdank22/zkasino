import "../styles/globals.css";
import { useEffect, useState } from 'react';
import type { AppProps } from "next/app";

import { WagmiConfig, createClient,useWebSocketProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, bscTestnet } from "wagmi/chains";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import Header from "../components/header/header";
import Cursor from "../components/Cursor";

export const isTouchScreen =
  typeof window !== `undefined` &&
  window.matchMedia("(pointer:coarse)").matches;

  



  


const client = createClient(
  getDefaultClient({
    appName: "ConnectKit Next.js demo",
    webSocketProvider: 'wss://frosty-damp-tree.bsc-testnet.discover.quiknode.pro/37e44079cabc424a14cdcb9f6bc159d8ab9d406e/',
    //alchemyId:  process.env.NEXT_PUBLIC_ALCHEMY_ID,
    chains: [bscTestnet, mainnet, polygon, optimism, arbitrum],
  })
);

function MyApp({ Component, pageProps }: AppProps) {

  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setDisplay(true);
  }, []);
  
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        
          <Header />
          <Component {...pageProps} />
          {display && !isTouchScreen ? <Cursor /> : <></>}

      </ConnectKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
