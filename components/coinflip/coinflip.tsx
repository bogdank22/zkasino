import { Slider } from 'antd';
import { Contract, ethers } from 'ethers';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import contracts from '../../const/abi.json';

export default function CoinFlip() {
	const { address, isConnected } = useAccount();
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
		console.log('provider====', provider);
		console.log('signer====', signer);
		console.log('slotContract===', slotContractSigner);
		if (isConnected) getApproveAmount();
	}, [isConnected]);

	const getApproveAmount = async () => {
		console.log(address);
		console.log(tokenContractProvider);
		const allowance = Number(await tokenContractProvider!.allowance(address, contracts.slotContract.address));
		console.log('allowance = ', ethers.utils.formatEther(String(allowance)));
		setApproveValue(Number(ethers.utils.formatEther(String(allowance))));
	};

	const ApproveClick = async () => {
		try {
			setButtonDisable(true);
			const transaction = await tokenContractSigner!.approve(contracts.slotContract.address, ethers.utils.parseEther(String(totalWager)));
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
			console.log('wager = ', _wager);
			console.log('address = ', address);
			console.log('stopGain = ', _stopGain);
			console.log('stopLoss = ', _stopLoss);
			const transaction = await slotContractSigner!.Slots_Play(_wager, tokenAddress, multiBets, _stopGain, _stopLoss, { value: ethers.utils.parseEther('0.1') });
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
			<p className='text-center mt-5 text-[40px] tracking-[.25em] font-Space-Grotesk text-[#d7a85c] font-bold'>COIN FLIP</p>
			<div className='flex justify-center mt-[100px]'>
				<div className='flex gap-4 w-[1300px] justify-center items-center'>
					<div className='w-[300px] items-center flex flex-col'>
						<div className='rounded-full -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-yellow-300 flex justify-center items-center shadow-yellow-300 dark:shadow-gray-900 mb-10'>
							<Image src='https://play.zkasino.io/img/rps/heads.png' width='150px' height='150px' alt='image' className='w-full h-full rounded-full absolute -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-rim_color flex justify-center items-center' />
						</div>
						<div className='flex justify-center items-center'>
							<div className='rounded-full -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-yellow-300 flex justify-center items-center shadow-yellow-300 dark:shadow-gray-900'>
								<Image src='https://play.zkasino.io/img/rps/heads.png' width='70px' height='70px' alt='image' className='w-full h-full rounded-full absolute -webkit-backface-visibility-hidden backface-visibility-hidden border-4 border-rim_color flex justify-center items-center' />
							</div>
							<div className='ml-2 flex items-center'>
								<Image src='https://play.zkasino.io/img/rps/tails.png' width='70px' height='70px' alt='image' className='grayscale' />
							</div>
						</div>
					</div>
					<div className='w-[300px] flex flex-col items-center'>
						<div className='w-[200px] p-1 pt-2 shadow-md relative container'>
							<p className='h-small text-white'>Wager</p>
							<div className='flex justify-between bg-[#2A0E23] p-[3px] border-[1px] border-[#2A0E23] hover:border-[#f3d9ae] mt-[5px] rounded-[4px]'>
								<h1 className='text-slate-600 font-bold'>X</h1>
								<input
									type='text'
									className='text-slate-600 font-bold w-full text-right text-white bg-transparent border-none focus:outline-none'
									placeholder='0'
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setWager(Number(e.target.value));
										setTotalWager(Number(e.target.value) * multiBets);
									}}
								/>
							</div>
						</div>
						<div className='w-[200px] p-1 pt-2 shadow-md relative container mt-2'>
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
								onChange={(value: number) => {
									setMultiBets(value);
									setTotalWager(wager * value);
								}}
								value={multiBets}
							/>
							<div className='flex justify-between'>
								<p className='text-xs text-white'>Stop&nbsp;Gain</p>
								<input
									type='text'
									className='w-[100px] h-[20px] bg-[#2A0E23] border-[1px] border-[#2A0E23] rounded-[4px] hover:border-[#f3d9ae] focus:outline-none font-bold text-[11px]  text-right text-white'
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										setStopGain(Number(e.target.value));
									}}
									placeholder='No limit'
								/>
							</div>

							<div className='flex justify-between mt-[2px]'>
								<p className='text-xs text-white'>Stop Gain</p>
								<input
									type='text'
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
						<div className='w-[200px] p-1 pt-2 shadow-md relative container mt-2'>
							{isConnected === false ? (
								<p className='text-center text-gray-300 font-bold'>Connect First</p>
							) : approveValue < totalWager ? (
								<button className='text-center text-gray-300 font-bold cursor-pointer' onClick={ApproveClick} disabled={buttonDisable}>
									Approve TUSD
								</button>
							) : (
								<button className='text-center text-gray-300 font-bold cursor-pointer' disabled={buttonDisable} onClick={playClick}>
									Play
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
