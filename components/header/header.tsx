import Link from "next/link";
import Image from 'next/image';
import { ConnectKitButton, ChainIcon } from "connectkit";
import { useAccount, useContract, useProvider, useSigner, useContractRead, useSwitchNetwork, useNetwork, useBalance } from 'wagmi';
import { BigNumber, Contract, ethers } from "ethers";
import contracts from "../../const/abi.json";
import { useEffect, useState } from "react";
import { sign } from "crypto";

const Header = () => {

  const { address, isConnected } = useAccount();
  const { chain, chains } = useNetwork();
  const { switchNetwork } = useSwitchNetwork()
  const { data: balance, isError, isLoading } = useBalance({ address });

  const [initialRenderComplete, setInitialRenderComplete] = useState<boolean>(false);
  const [userTokenBalance, setuserTokenBalance] = useState("Wallet Not Connected");
  const [coinsAmount, setCoinsAmount] = useState(0);
  const { data } = useContractRead({
    // contract address
    address: contracts.tokenContract.address as any,
    abi: contracts.tokenContract.abi,
    functionName: "balanceOf",

    args: [address],
  });

  useEffect(() => {
    setInitialRenderComplete(true);
    if (isConnected) {
      // console.log(address, isConnected, data);
      const value = BigNumber.from(data?._hex);
      setuserTokenBalance(ethers.utils.formatUnits(value, 18));
    } else {
      setuserTokenBalance("0");
    }
  }, [address, chain]);

  if (!initialRenderComplete) {
    return null;
  } else {
    return (
      <>
        <div className="sticky top-0 flex justify-between items-center border-b backdrop-blur-md z-50 header">
          <div className="flex gap-4 px-4 place-items-center">
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
          <div className="flex">
            <div className="flex flex-col justify-center text-white mx-4">
              <div className="flex justify-end items-center">
                <p className="mx-2">{!balance ? 0 : Number(balance?.formatted).toFixed(2)}</p>
                <ChainIcon size={16} id={chain?.id} />
              </div>
              <div className="flex justify-end items-center">
                <p className="mx-2">{`${Number(userTokenBalance) <= 0 || isNaN(Number(userTokenBalance)) ? 0 : Number(userTokenBalance).toFixed(2)} tUSD`}</p>
              </div>
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
            {
              !chain ? <></> :
                <div className="bg-[#c007a1] w-[200px]">
                  <div className="flex justify-end items-center peer px-2 py-2 bg-transparnet hover:bg-[#c007a1aa] text-center text-white font-bold cursor-pointer">
                    <p className="mx-3">{chain?.name}</p>
                    <ChainIcon size={32} id={chain?.id} />
                  </div>
                  <div className="hidden peer-hover:absolute peer-hover:flex hover:absolute hover:flex w-[200px] flex-col bg-[#322e2e] drop-shadow-lg border border-solid border-[#333333]">
                    {
                      chains?.map((xchain, index) =>
                        <button
                          key={index}
                          className="flex justify-end items-center px-2 py-3 hover:bg-[#61616133] hover:text-[#fdc66c] cursor-pointer text-white font-medium"
                          disabled={!switchNetwork || xchain.id === chain?.id}
                          onClick={() => switchNetwork?.(xchain.id)}
                        >
                          <p className="mx-3">{xchain.name}</p>
                          <ChainIcon size={32} id={xchain.id} />
                        </button>
                      )
                    }
                  </div>
                </div>
            }
          </div>
        </div>
      </>
    );
  }
};

export default Header;
