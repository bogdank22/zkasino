import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from "connectkit";
import styled from "styled-components";
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

const StyledButton = styled.button`
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 10px 18px;
  color: #9659FB;
  background: none;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10rem;
  border: 1px solid #9659FB;
  margin: auto;
  transition: 200ms ease;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 6px 40px -6px #9659FB;
  }
  &:active {
    transform: translateY(-3px);
    box-shadow: 0 6px 32px -6px #9659FB;
  }
`;

export default function Home() {
  return (
    <>
    <div className="flex justify-center h-[100vh] w-full">
      <div className="flex">
      <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <StyledButton onClick={show}>
            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
          </StyledButton>
        );
      }}   
      </ConnectKitButton.Custom>
    </div>
    </div>
    </>
  )
}
