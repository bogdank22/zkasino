import Link from "next/link";

type Props = {};

export default function Slot({}: Props) {
  return (
    <div>
      <h1 className="text-center mt-5 text-[40px] tracking-[.25em] font-Space-Grotesk text-[#b38228] font-bold">
        SLOTS
      </h1>
      <div className="flex justify-center">
        <div className="flex gap-4 w-[1200px]">
          <div className="grid grid-cols-3 gap-3 bg-transparent bg-white/10 p-4 rounded-[8px]">
            <div className="px-[20px] py-[50px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-[3px] ">
              <img
                src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                alt="image"
                className="w-[100px] h-[100px]"
              ></img>
            </div>
            <div className="px-[20px] py-[50px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-[3px]">
              <img
                src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                alt="image"
                className="w-[100px] h-[100px]"
              ></img>
            </div>
            <div className="px-[20px] py-[50px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-[3px]">
              <img
                src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                alt="image"
                className="w-[100px] h-[100px]"
              ></img>
            </div>
          </div>
          <div className="w-[200px]">
            <div className="p-2 bg-white/10 rounded-[4px]">
              <h1 className="h-small text-white">Wager</h1>
              <div className="flex justify-between bg-[#2A0E23] p-[3px] border-[1px] border-[#2A0E23] hover:border-[#f3d9ae] mt-[5px] rounded-[4px]">
                <h1 className="text-slate-600 font-bold">X</h1>
                <input
                  className="text-slate-600 font-bold w-full text-right text-white bg-transparent border-none focus:outline-none"
                  placeholder="0"
                ></input>
              </div>
              <div></div>
            </div>
            <div className="p-2 bg-white/10 rounded-[4px] mt-2">
              <div className="flex justify-between">
                <h1 className="h-small text-white">Multi Bets</h1>
                <input
                  className="bg-[#2A0E23] text-slate-600 font-bold w-[60px] h-[20px] text-right text-white border-[1px] border-[#2A0E23] hover:border-[#f3d9ae] focus:border-[#f3d9ae] w-[60px] rounded-[4px]"
                  placeholder="1"
                ></input>
              </div>
              <div className="flex justify-between">
                <h1 className="h-small text-white">Stop Gain</h1>
                <h1 className="h-small text-white text-xs flex justify-center item-center">No limit</h1>
              </div>
              <div className="flex justify-between">
                <h1 className="h-small text-white">Stop Gain</h1>
                <h1 className="h-small text-white text-xs">No limit</h1>
              </div>
              <h1 className="h-small text-white">Total Wager</h1>
              <div className="flex justify-between">
                <div></div>
                <h1 className="h-small text-white text-xs font-bold">0.0</h1>
              </div>
            </div>
            <div className="p-2 bg-white/10 rounded-[4px] mt-2">
              <h1 className="text-center text-gray-300 font-bold">Connect First</h1>
            </div>
          </div>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
