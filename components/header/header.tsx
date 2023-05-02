import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import { useAccount, useContract, useProvider, useSigner,useContractRead } from 'wagmi';
import { BigNumber, Contract, ethers } from "ethers";
import contracts from "../../const/abi.json";
import { useEffect, useState } from "react";

const Header = () => {

  const {address,isConnected} = useAccount();
  
  const [userTokenBalance, setuserTokenBalance] = useState("Wallet Not Connected");
  const { data, isLoading, error } = useContractRead({
    // contract address
    address: contracts.tokenContract.address as any ,
    abi: contracts.tokenContract.abi,
    functionName: "balanceOf",

    args: [address],
  });
  useEffect(() => {
    if (isConnected) {
      const value = BigNumber.from(data?._hex);
      setuserTokenBalance(ethers.utils.formatUnits(value, 18));

     
    }

  }, [address]);




  return (
    <div className="sticky top-0 p-2 flex justify-between border-b backdrop-blur-md z-50 header">
      <div className="flex gap-4 place-items-center">
        <Link href="/Games">
          <h1 className="text-white hover:text-[#f8d294] font-poppins cursor-pointer">Games</h1>
        </Link>
        <Link href="/Leaderboard">
          <h1 className="text-white hover:text-[#f8d294] font-poppins cursor-pointer">Leaderboard</h1>
        </Link>
        <Link href="/Promotions">
          <h1 className="text-white hover:text-[#f8d294] font-poppins cursor-pointer">Promotions</h1>
        </Link>
      </div>
      <div className="text-white">
        <>
        Balance : (tusd){userTokenBalance}

        </>
      </div>
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
  );
};

export default Header;
