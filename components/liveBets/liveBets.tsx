import { useEffect, useState } from "react";
import axios from "axios";

const LiveBets = () => {
  const [lives, setLives] = useState([]);

  useEffect(() => {
    getLives();
  }, []);

  const getLives = async () => {
    await axios
      .get("http://localhost/api/live/getLives", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        },
      })
      .then((res) => {
        console.log(res.data);
        setLives(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="bg-white/5 w-[945px] mt-[50px] mx-auto p-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <h1 className="text-[#fdc66c] text-bold">Live Bets</h1>
        </div>
        <button className="bg-[#fdc66c] text-black px-[10px] py-[5px] font-bold rounded-[8px]">
          View Personal
        </button>
      </div>

      <div className="mt-[30px]">
        <div className="grid grid-cols-6 gap-3 justify-between">
            <h1 className="text-gray-500">Tx Time</h1>
            <h1 className="text-gray-500">Game</h1>
            <h1 className="text-gray-500">Player</h1>
            <h1 className="text-gray-500 text-right">Wager</h1>
            <h1 className="text-gray-500 text-center">Multiplier</h1>
            <h1 className="text-gray-500 text-right">Profit</h1>
        </div>
        {
            lives.map((live,index) => (
                <div className="grid grid-cols-6 justify-between" key={index} >
                    <h1 className="text-white">{String(live.date).slice(11,19)}</h1>
                    <h1 className="text-white">Slots</h1>
                    <h1 className="text-white">{(String(live.playAddress).slice(0,4) + '...' + String(live.playAddress).slice(-4))}</h1>
                    <h1 className="text-white text-right">{live.wager} * {live.numbets}</h1>
                    <h1 className="text-white text-center">{live.multiplier}</h1>
                    <h1 className="text-white text-right">{live.profit}</h1>
                </div>
            ))
        }
      </div>
    </div>
  );
};

export default LiveBets;
