import { Slider, notification } from 'antd';
import { Contract, ethers } from 'ethers';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useContract, useProvider, useSigner, useSwitchNetwork, useNetwork } from 'wagmi';
import contracts from '../../const/abi.json';
import coinFlipContract from '../../const/coinflipabi.json';
import { Hooka } from '../Hooka';
import Link from 'next/link';
// import Notification from '../notification';

export default function CoinFlip() {
	const isMounted = Hooka()
	const { address, isConnected } = useAccount();
	const { chains, chain } = useNetwork();
	const { switchNetwork } = useSwitchNetwork();
	const provider = useProvider();
	const { data: signer } = useSigner();

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

	const coinFlipContractSigner: Contract | null = useContract({
		address: coinFlipContract.coinFlip.address,
		abi: coinFlipContract.coinFlip.abi,
		signerOrProvider: signer,
	});

	const [api, contextHolder] = notification.useNotification();
	const [approveValue, setApproveValue] = useState<Number>(0);
	const [wager, setWager] = useState<number>(0);
	const [multiBets, setMultiBets] = useState<number>(1);
	const [stopGain, setStopGain] = useState<number>(0);
	const [stopLoss, setStopLoss] = useState<number>(0);
	const [totalWager, setTotalWager] = useState<number>(0);
	const [buttonDisable, setButtonDisable] = useState<boolean>(false);
	const [isHeads, setIsHeads] = useState<boolean>(false);
	const [initialRenderComplete, setInitialRenderComplete] = useState<boolean>(false);

	useEffect(() => {
		console.log('provider====', provider);
		console.log('signer====', signer);
		console.log('coinFlipContract===', coinFlipContractSigner);
		setInitialRenderComplete(true);
		if (chains.find(ch => ch.id === chain?.id)) {
			if (isConnected && chain?.id == 97) {
				console.log("change wager")
				wager > 0 ? setButtonDisable(false) : setButtonDisable(true);
				getApproveAmount();
			} else {
				setButtonDisable(true);
			}
		} else {
			setButtonDisable(true);
		}
	}, [isConnected, chain, wager]);

	const getApproveAmount = async () => {
		console.log(address);
		console.log(tokenContractProvider);
		const allowance = await tokenContractProvider!.allowance(address, coinFlipContract.coinFlip.address);
		console.log('allowance = ', ethers.utils.formatEther(String(allowance)));
		setApproveValue(Number(ethers.utils.formatEther(String(allowance))));
	};

	const ApproveClick = async () => {
		try {
			setButtonDisable(true);
			const amount = ethers.utils.parseEther(String(totalWager));
			console.log(amount);
			const transaction = await tokenContractSigner!.approve(coinFlipContract.coinFlip.address, amount);
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
	// const setHeads = async () => {
	// 	setIsHeads(true)
	// }


	const playClick = async () => {
		try {
			setButtonDisable(true);
			const _wager = ethers.utils.parseEther(String(wager));
			const _stopGain = ethers.utils.parseEther(String(stopGain));
			const _stopLoss = ethers.utils.parseEther(String(stopLoss));
			const tokenAddress = contracts.tokenContract.address;
			console.log('wager = ', _wager);
			console.log('address = ', address);
			console.log('stopGain = ', _stopGain);
			console.log('stopLoss = ', _stopLoss);
			console.log('isHeads', isHeads)
			let transaction;
			for (let i = 0; i < multiBets; i++) {
				transaction = await coinFlipContractSigner!.CoinFlip_Play(_wager, tokenAddress, isHeads, multiBets, _stopGain, _stopLoss, { value: ethers.utils.parseEther('0.05') });
				const tx = await transaction.wait();
				if (tx !== null) {
					setButtonDisable(false);
					openNotification('info');
				}
			}
			getApproveAmount();
		} catch (err) {
			setButtonDisable(false);
			openNotification('error');
			console.log(err);
		}
	};

	const openNotification = (messageType: string) => {
		const key = `open${Date.now()}`;
		const btn = (
			<Link href="#">
				View Link
			</Link>
		);
		if (messageType == 'info') {
			api.info({
				style: { background: 'radial-gradient(circle at 50% 0,rgba(233,34,183,.25),transparent), #333', color: "#fff", padding: "8px" },
				message: <h5 className='text-lg text-white font-bold'>PLAY COIN FLIP</h5>,
				description: <p className='text-base text-white font-medium'>Transaction accepted.</p>,
				btn,
				key,
			});
		} else if (messageType == 'error') {
			api.error({
				style: { background: 'radial-gradient(circle at 50% 0,rgba(233,34,50,.25),transparent), #333', color: "#fff", padding: "8px" },
				message: <h5 className='text-lg text-white font-bold'>PLAY COIN FLIP</h5>,
				description: <p className='text-base text-red-500 font-medium'>Transaction failed.</p>,
				key,
			});
		}
	};

	if (!initialRenderComplete) {
		return null;
	} else {
		return (
			<>
				{contextHolder}
				<div>
					<p className='text-center mt-5 text-[40px] tracking-[.25em] font-Space-Grotesk text-[#d7a85c] font-bold'>COIN FLIP</p>
					<div className='flex justify-center mt-[100px]'>
						<div className='flex gap-4 w-[1300px] justify-center items-center'>
							<div className='w-[300px] items-center flex flex-col'>
								<div className='rounded-full -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-yellow-300 flex justify-center items-center shadow-yellow-300 dark:shadow-gray-900 mb-10'>
									{
										isHeads ?
											<Image src='https://play.zkasino.io/img/rps/heads.png' width='150px' height='150px' alt='image' className='w-full h-full rounded-full absolute -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-rim_color flex justify-center items-center' /> :
											<Image src='https://play.zkasino.io/img/rps/tails.png' width='150px' height='150px' alt='image' className='w-full h-full rounded-full absolute -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-rim_color flex justify-center items-center' />
									}
								</div>
								<div className='flex justify-center items-center'>
									<div className='text-center'>
										<div className={`head-tail mx-2 rounded-full -webkit-backface-visibility-hidden backface-visibility-hidden flex justify-center items-center${isHeads ? ' select border-4 border-yellow-300 shadow-yellow-300 dark:shadow-gray-900' : ' border-4 border-transparent'}`}>
											<Image onClick={() => { setIsHeads(true) }} src='https://play.zkasino.io/img/rps/heads.png' width='70px' height='70px' alt='image' className='w-full h-full rounded-full absolute -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-rim_color flex justify-center items-center cursor-pointer' />
										</div>
										<p className={`text-base font-bold my-4 ${isHeads ? 'text-lime-500' : 'text-zinc-400'}`}>{isHeads ? "+" + totalWager.toFixed(2) : "-" + totalWager.toFixed(2)}</p>
									</div>
									<div className='text-center'>
										<div className={`head-tail mx-2 rounded-full -webkit-backface-visibility-hidden backface-visibility-hidden flex justify-center items-center${!isHeads ? ' select border-4 border-yellow-300 shadow-yellow-300 dark:shadow-gray-900' : ' border-4 border-transparent'}`}>
											<Image onClick={() => { setIsHeads(false) }} src='https://play.zkasino.io/img/rps/tails.png' width='70px' height='70px' alt='image' className='w-full h-full rounded-full absolute -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-rim_color flex justify-center items-center cursor-pointer' />
										</div>
										<p className={`text-base font-bold my-4 ${!isHeads ? 'text-lime-500' : 'text-zinc-400'}`}>{!isHeads ? "+" + totalWager.toFixed(2) : "-" + totalWager.toFixed(2)}</p>
									</div>
								</div>
							</div>
							<div className='w-[300px] flex flex-col items-center'>
								<div className='w-[200px] p-1 pt-2 shadow-md relative container'>
									<p className='h-small text-white'>Wager</p>
									<div>
										<div className='flex justify-between bg-[#2A0E23] p-[3px] border-[1px] border-[#2A0E23] hover:border-[#f3d9ae] mt-[5px] rounded-[4px]'>
											<button className='text-slate-600 font-bold' onClick={() => { setWager(0); setTotalWager(0); }}>X</button>
											<input
												type='number'
												className='peer text-slate-600 font-bold w-full text-right text-white bg-transparent border-none focus:outline-none'
												placeholder='0'
												value={wager <= 0 ? '' : wager}
												onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
													setWager(Number(e.target.value));
													setTotalWager(Number(e.target.value) * multiBets);
												}}
											/>
										</div>
										<p className="mt-2 invisible peer-invalid:visible text-pink-600 text-sm">
											Please provide a valid email address.
										</p>
									</div>
								</div>
								<div className='w-[200px] p-2 pt-2 shadow-md relative container mt-2'>
									<div className='flex justify-between'>
										<p className='text-xs text-white'>Multiple Bets</p>
										<div className='flex items-center'>
											<input
												type='text'
												className='w-[60px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold  text-right text-white'
												onChange={(e) => {
													setMultiBets(Number(e.target.value));
													setTotalWager(wager * Number(e.target.value));
												}}
												value={multiBets.toString()}
											/>
										</div>
									</div>

									<Slider
										defaultValue={1}
										min={1}
										max={100}
										disabled={false}
										railStyle={{ "background": "#454545" }}
										onChange={(value: number) => {
											setMultiBets(value);
											setTotalWager(wager * value);
										}}
										value={multiBets}
									/>
									<div className='flex justify-between'>
										<p className='text-xs text-white'>Stop&nbsp;Gain</p>
										<input
											type='number'
											className='w-[100px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold text-[11px]  text-right text-white'
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												setStopGain(Number(e.target.value));
											}}
											placeholder='No limit'
										/>
									</div>

									<div className='flex justify-between mt-2'>
										<p className='text-xs text-white'>Stop Gain</p>
										<input
											type='number'
											className='w-[100px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold text-[11px]  text-right text-white'
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												setStopLoss(Number(e.target.value));
											}}
											placeholder='No limit'
										/>
									</div>

									<p className='text-small text-white'>Total Wager</p>

									<div className='flex justify-between'>
										<div></div>
										<p className='h-small text-white text-xs font-bold'>{totalWager.toFixed(1)}</p>
									</div>
								</div>
								<div className='w-[200px] shadow-md relative container mt-2 text-center'>
									<>
										{isConnected === false || chains.find(ch => ch.id === chain?.id) === undefined || chain?.id !== 97 ? (
											<><p className='text-center text-[#8e898c] py-2 font-bold'>Connect First</p></>
										) : wager <= 0 ? <p className='text-center py-2 text-[#8e898c] font-bold'>Enter a wager</p>
											: Number(approveValue) < totalWager ? (
												<button className='w-full p-2 text-center text-gray-300 font-bold cursor-pointer border-[#fdc66c] disabled:bg-[#61616133]' onClick={ApproveClick} disabled={buttonDisable}>
													Approve TUSD
												</button>
											) : (
												<button className='w-full p-2 text-center text-gray-900 font-bold cursor-pointer rounded border-[#fdc66c] bg-[#fdc66c] disabled:bg-transparent disabled:cursor-default' disabled={buttonDisable} onClick={playClick}>
													Play
												</button>
											)}
									</>
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}
