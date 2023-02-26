import type { AppProps } from "next/app";
import { WagmiConfig, createClient } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { bscTestnet } from "wagmi/chains";
import Header from "@/components/header/header";
import "@/styles/globals.css";

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
      <ConnectKitProvider theme="auto" mode="dark">
        <div className="bg-gradient-to-b from-[#340834] via-[#140814] to-[#040804] relative h-[100vh] w-full">
          <Header />
          <Component {...pageProps} />
        </div>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
