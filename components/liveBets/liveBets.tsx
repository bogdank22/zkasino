import { useEffect, useState } from "react";
import { useNetwork, useAccount, useContract, useProvider, useContractEvent } from "wagmi";
import axios from "axios";
import Link from "next/link";
import { ChainIcon } from "connectkit";
import { MdContentCopy } from 'react-icons/md';
import { BigNumber, Contract, ethers } from 'ethers';
import contracts from '../../const/abi.json';
import coinflipContract from '../../const/coinflipabi.json';
import moment from "moment";
import { Props } from "next/script";

interface ILive {
  game: string,
  transaction: string;
  date: Date;
  playAddress: string;
  wager: number;
  numbets: number;
  multiplier: number;
  profit: number;
}

const LiveBets = (props: Props) => {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [lives, setLives] = useState<ILive[]>([]);
  const [renderLives, setRenderLives] = useState<ILive[]>([]);
  const [personalLives, setPersonalLives] = useState<boolean>(false);

  useEffect(() => {
    console.log("useEffect")
    getLives();
  }, []);

  useEffect(() => {
    if (personalLives) {
      const personal = lives?.filter(live => live.playAddress == address);
      setRenderLives(personal);
    } else {
      setRenderLives(lives);
    }
  }, [personalLives]);

  const getLives = async () => {
    await axios
      .get("http://localhost:3000/api/livebets", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
      })
      .then((res) => {
        console.log(res);
        let lives;
        console.log("gameType", props);

        switch(props?.gameType) {
          case 0:
            lives = res?.data.filter((item: ILive) => item.game == 'Slots');
            setLives(lives);
            setRenderLives(lives);
            break;
          case 1:
            lives = res?.data.filter((item: ILive) => item.game == 'Coin Flip');
            setLives(lives);
            setRenderLives(lives);
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useContractEvent({
    address: "0x58ED08Bbd6c277ac50EA6e4018fF931A59bf62D7",
    abi: contracts.slotContract.abi,
    eventName: 'Slots_Outcome_Event',
    async listener(playAddress: any, wager: any, payout: any, tokenAddress: any, slotIDs: any, multipliers: any, payouts: any, numGames: any, event: any) {
      console.log("===================>", playAddress, wager, payout, tokenAddress, slotIDs, multipliers, payouts, numGames, event);
      const newLive: ILive = {
        game: "Slots",
        transaction: event.transactionHash,
        playAddress: playAddress,
        wager: Number(ethers.utils.formatEther(wager)),
        numbets: slotIDs.length,
        multiplier: Number(ethers.utils.formatEther(payout)) / (Number(ethers.utils.formatEther(wager)) * slotIDs.length),
        profit: Number(ethers.utils.formatEther(payout)) - Number(ethers.utils.formatEther(wager)) * slotIDs.length,
        date: new Date
      };

      const res = await fetch('/api/livebets', {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
        method: 'POST',
        body: JSON.stringify(newLive)
      });
      console.log(newLive, res)
      setRenderLives([...renderLives, newLive])
    },
  })

  useContractEvent({
    address: "0x90d5dBb087023c5D4449bB7a50B5252a6BD9dF04",
    abi: coinflipContract.coinFlip.abi,
    eventName: 'CoinFlip_Outcome_Event',
    async listener(playAddress: any, wager: any, payout: any, tokenAddress: any, coinOutcomes: any, payouts: any, numGames: any, event: any) {
      console.log("===================>", playAddress, wager, Number(ethers.utils.formatEther(payout)), tokenAddress, coinOutcomes, payouts, numGames, event.transactionHash);
      const newLive: ILive = {
        game: "Coin Flip",
        transaction: event.transactionHash,
        playAddress: playAddress,
        wager: Number(ethers.utils.formatEther(wager)),
        numbets: payouts.length,
        multiplier: Number(ethers.utils.formatEther(payout)) / (Number(ethers.utils.formatEther(wager))*numGames?.length),
        profit: Number(ethers.utils.formatEther(payout)) - Number(ethers.utils.formatEther(wager))*numGames?.length,
        date: new Date
      };

      const res = await fetch('/api/livebets', {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
        method: 'POST',
        body: JSON.stringify(newLive)
      });
      console.log(newLive, res)
      setRenderLives([...renderLives, newLive])
    },
  })

  return (
    <>
      <div className="bg-white/5 w-[945px] my-[50px] mx-auto p-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <h1 className="text-[#fdc66c] text-bold">
              Live Bets
            </h1>
          </div>
          <button className="bg-[#fdc66c] text-black px-[10px] py-[5px] font-bold rounded-[8px]" onClick={() => setPersonalLives(!personalLives)}>
            {personalLives ? 'View Global' : 'View Personal'}
          </button>
        </div>

        <div className="mt-[30px]">
          <div className="grid grid-cols-6 gap-3 m-2 justify-between">
            <h1 className="text-gray-500 font-bold">Tx Time</h1>
            <h1 className="text-gray-500 font-bold">Game</h1>
            <h1 className="text-gray-500 font-bold">Player</h1>
            <h1 className="text-gray-500 font-bold text-right">Wager</h1>
            <h1 className="text-gray-500 font-bold text-center">Multiplier</h1>
            <h1 className="text-gray-500 font-bold text-right">Profit</h1>
          </div>
          {
            renderLives.map((live, index) => (
              <div className={`live-row grid grid-cols-6 justify-between p-2${live?.playAddress == address ? ' border-l-2 border-[#e92277] bg-gradient-to-r from-[#e9207780] to-transparent' : ''}`} key={index}>
                <a href={`${chain?.blockExplorers?.default.url}/tx/${live?.transaction}`} target="_blank">
                  <h1 className="cursor-pointer text-[#8e898c] hover:text-[#fdc66c]">{moment(live.date).format('hh:mm:ss')}</h1>
                </a>
                <h1 className="text-white flex items-center"><ChainIcon id={chain?.id} size={16} />&nbsp;{live?.game}</h1>
                <a href="#" className="flex items-center text-white">
                  {(String(live.playAddress).slice(0, 6) + '...' + String(live.playAddress).slice(-4))}&nbsp;
                  <MdContentCopy />
                </a>
                <h1 className="flex justify-end items-center text-white text-right font-bold">{live.numbets} x {live.wager}&nbsp;<ChainIcon id={chain?.id} size={16} /></h1>
                <h1 className="text-white text-center font-bold">{live.multiplier}x</h1>
                <h1 className={`flex justify-end items-center text-right font-bold${live.profit > 0 ? ' text-[#00ff00]' : ' text-[#8e898c]'}`}>{live.profit > 0 ? '+' : ''}{live.profit}&nbsp;<ChainIcon id={chain?.id} size={16} /></h1>
              </div>
            ))
          }
        </div>
      </div>
    </>
  );
};

export default LiveBets;