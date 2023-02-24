import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from "connectkit";
import styled from "styled-components";
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
    <div className="flex justify-center h-[100vh] w-full">
      <div className="flex">
      <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <div className="connectButton" onClick={show}>
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </div>
        );
      }}   
      </ConnectKitButton.Custom>
    </div>
    </div>
    </>
  )
}
