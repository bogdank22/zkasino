import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { useAccount, useContract, useProvider, useSigner } from "wagmi";
import Image from "next/image";
import { Slider, Switch } from 'antd';
import contracts from "../../const/abi.json";

export default function Slot() {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  const tokenContractProvider: Contract | null = useContract({
    address: contracts.tokenContract.address,
    abi: contracts.tokenContract.abi,
    signerOrProvider: provider,
  });

  const tokenContractSigner: Contract | null = useContract({
    address: contracts.tokenContract.address,
    abi: contracts.tokenContract.abi,
    signerOrProvider: signer,
  });

  const slotContractSigner: Contract | null = useContract({
    address: contracts.slotContract.address,
    abi: contracts.slotContract.abi,
    signerOrProvider: signer,
  });

  const [approveValue, setApproveValue] = useState<Number>(0);
  const [wager, setWager] = useState<number>(0);
  const [multiBets, setMultiBets] = useState<number>(1);
  const [stopGain, setStopGain] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [totalWager, setTotalWager] = useState<number>(0);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

  useEffect(() => {
    console.log("provider====", provider);
    console.log("signer====", signer);
    console.log("slotContract===", slotContractSigner);
    if(isConnected)
      getApproveAmount();
  }, [isConnected]);

  const getApproveAmount = async () => {
    console.log(address);
    console.log(tokenContractProvider);
    const allowance = Number(
      await tokenContractProvider!.allowance(
        address,
        contracts.slotContract.address
      )
    );
    console.log("allowance = ", ethers.utils.formatEther(String(allowance)));
    setApproveValue(Number(ethers.utils.formatEther(String(allowance))));
  };

  const ApproveClick = async () => {
    try {
      setButtonDisable(true);
      const transaction = await tokenContractSigner!.approve(
        contracts.slotContract.address,
        ethers.utils.parseEther(String(totalWager))
      );
      const tx = await transaction.wait();

      if (tx !== null) {
        getApproveAmount();
        setButtonDisable(false);
      }
    } catch (err) {
      setButtonDisable(false);
      console.log(err);
    }
  };

  const playClick = async () => {
    try {
      setButtonDisable(true);
      const _wager = ethers.utils.parseEther(String(wager));
      const _stopGain = ethers.utils.parseEther(String(stopGain));
      const _stopLoss = ethers.utils.parseEther(String(stopLoss));
      const tokenAddress = contracts.tokenContract.address;
      console.log("wager = ", _wager);
      console.log("address = ", address);
      console.log("stopGain = ", _stopGain);
      console.log("stopLoss = ", _stopLoss);
      const transaction = await slotContractSigner!.Slots_Play(
        _wager,
        tokenAddress,
        multiBets,
        _stopGain,
        _stopLoss,
        { value: ethers.utils.parseEther("0.1") }
      );
      const tx = await transaction.wait();
      if (tx !== null) {
        getApproveAmount();
        setButtonDisable(false);
      }
    } catch (err) {
      setButtonDisable(false);
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-center mt-5 text-[40px] tracking-[.25em] font-Space-Grotesk text-[#d7a85c] font-bold">
        SLOTS
      </h1>
      <div className="flex justify-center mt-[100px]">
        <div className="flex gap-4 w-[1300px]">
          <div className="grid grid-cols-3 gap-3 bg-white/5 p-4 rounded-[8px]">
            <div className="px-[10px] py-[50px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-[3px] flex items-center">
              <div>
                <Image
                  src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                  width={130}
                  height={130}
                  alt="image"
                />
              </div>
            </div>
            <div className="px-[10px] py-[50px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-[3px] flex items-center">
              <div>
                <Image
                  src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                  width={130}
                  height={130}
                  alt="image"
                />
              </div>
            </div>
            <div className="px-[10px] py-[50px] bg-gradient-to-b from-white/30 via-white to-white/30 rounded-[3px] flex items-center">
              <div>
                <Image
                  src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                  width={130}
                  height={130}
                  alt="image"
                />
              </div>
            </div>
          </div>
          <div className="w-[200px]">
            <div className="py-2 px-4 bg-white/5 rounded-[4px]">
              <h1 className="h-small text-white">Wager</h1>
              <div className="flex justify-between bg-[#2A0E23] p-[3px] border-[1px] border-[#2A0E23] hover:border-[#f3d9ae] mt-[5px] rounded-[4px]">
                <h1 className="text-slate-600 font-bold">X</h1>
                <input
                  type="text"
                  className="text-slate-600 font-bold w-full text-right text-white bg-transparent border-none focus:outline-none"
                  placeholder="0"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setWager(Number(e.target.value));
                    setTotalWager(Number(e.target.value) * multiBets);
                  }}
                ></input>
              </div>
              <div></div>
            </div>
            <div className="py-2 px-4 bg-white/5 rounded-[4px] mt-2">
              <div className="flex justify-between">
                <h1 className="text-xs text-white">Multiple Bets</h1>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="w-[60px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold  text-right text-white"
                    onChange={(e) => {
                      setMultiBets(Number(e.target.value));
                      setTotalWager(wager * Number(e.target.value));
                    }}
                    value={multiBets.toString()}
                />
                </div>
              </div>

              <Slider defaultValue={1} min={1} max={100} disabled={false} onChange={(
                  value: number,
                ) => {
                  setMultiBets(value);
                  setTotalWager(wager * value);
                }} value={multiBets} />
              <div className="flex justify-between">
                <h1 className="text-xs text-white">Stop&nbsp;Gain</h1>
                <input
                  type="text"
                  className="w-[100px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold text-[11px]  text-right text-white"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStopGain(Number(e.target.value));
                  }}
                  placeholder="No limit"
                />
              </div>

              <div className="flex justify-between mt-[2px]">
                <h1 className="text-xs text-white">Stop Gain</h1>
                <input
                  type="text"
                  className="w-[100px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold text-[11px]  text-right text-white"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setStopLoss(Number(e.target.value));
                  }}
                  placeholder="No limit"
                />
              </div>

              <h1 className="text-small text-white">Total Wager</h1>

              <div className="flex justify-between">
                <div></div>
                <h1 className="h-small text-white text-xs font-bold">
                  {totalWager.toFixed(1)}
                </h1>
              </div>
            </div>
            <div className="py-2 px-4 bg-white/5 rounded-[4px] mt-2 flex justify-center">
              {isConnected === false ? (
                <h1 className="text-center text-gray-300 font-bold">
                  Connect First
                </h1>
              ) : (approveValue < totalWager) ? (
                <button
                  className="text-center text-gray-300 font-bold cursor-pointer"
                  onClick={ApproveClick}
                  disabled={buttonDisable}
                >
                  Approve TUSD
                </button>
              ) : (
                <button
                  className="text-center text-gray-300 font-bold cursor-pointer"
                  disabled={buttonDisable}
                  onClick={playClick}
                >
                  Play
                </button>
              )}
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-[8px]">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <h1 className="text-[15px] text-gray-400">Outcome</h1>
                <div className="grid grid-cols-3 gap-10 ">
                  <Image
                    src="	https://play.zkasino.io/_next/static/media/soyjack_up.0c911b59.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="	https://play.zkasino.io/_next/static/media/soyjack_up.0c911b59.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="	https://play.zkasino.io/_next/static/media/soyjack_up.0c911b59.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/feelsgood.8c010c53.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/feelsgood.8c010c53.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/feelsgood.8c010c53.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/doge.90a2b1ed.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/doge.90a2b1ed.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                    <Image
                      src="https://play.zkasino.io/_next/static/media/doge.90a2b1ed.png"
                      width={30}
                      height={30}
                      alt="image"
                    />
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/yeschad.da140e9b.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/yeschad.da140e9b.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/yeschad.da140e9b.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/bear.5513da11.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/bear.5513da11.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/bear.5513da11.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                </div>                
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <Image
                    src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                  <h1 className="text-white font-bold text-center w-full">-</h1>
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <Image
                    src="https://play.zkasino.io/_next/static/media/grug.3d2f545d.png"
                    width={30}
                    height={30}
                    alt="image"
                  />
                 <h1 className="text-white font-bold text-center w-full">-</h1>
                 <h1 className="text-white font-bold text-center w-full">-</h1>
                </div>
              </div>
              <div className="flex justify-center">
                <div>
                <h1 className="text-[15px] text-gray-400">Multiplier</h1>
                <h1 className="text-white font-bold text-right h-[30px]">100X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">45X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">20X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">12X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">10X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">5X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">3X</h1>
                <h1 className="text-white font-bold text-right h-[30px]">2X</h1>
                </div>
              </div>
              <div className="flex justify-center">
                <div>
                <h1 className="text-[15px] text-gray-400">Payout</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                <h1 className="text-white font-bold text-right h-[30px]">-</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
