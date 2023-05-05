import { useEffect, useState } from "react";
import { useNetwork, useAccount } from "wagmi";
import axios from "axios";
import Link from "next/link";
import { ChainIcon } from "connectkit";
import Chain from "connectkit/build/components/Common/Chain";
import { MdContentCopy } from 'react-icons/md';

interface ILive {
  transaction: string;
  date: Date;
  playAddress: string;
  wager: number;
  numbets: number;
  multiplier: number;
  profit: number;
}

const LiveBets = () => {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [lives, setLives] = useState<ILive[]>([]);
  const [renderLives, setRenderLives] = useState<ILive[]>([]);
  const [personalLives, setPersonalLives] = useState<boolean>(false);

  console.log(chain)
  useEffect(() => {
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
      .get("http://localhost:5000/api/live/getLives", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setLives(res.data);
        setRenderLives(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
            View Personal
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
                  <h1 className="cursor-pointer text-[#8e898c] hover:text-[#fdc66c]">{String(live.date).slice(11, 19)}</h1>
                </a>
                <h1 className="text-white flex items-center"><ChainIcon id={chain?.id} size={16} />&nbsp;Slots</h1>
                <a href="#" className="flex items-center text-white">
                  {(String(live.playAddress).slice(0, 6) + '...' + String(live.playAddress).slice(-4))}&nbsp;
                  <MdContentCopy />
                </a>
                <h1 className="flex justify-end items-center text-white text-right font-bold">{live.wager} x {live.numbets}&nbsp;<ChainIcon id={chain?.id} size={16} /></h1>
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
