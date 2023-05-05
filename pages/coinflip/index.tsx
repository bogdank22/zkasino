import type { NextPage } from 'next';
import CoinFlip from '../../components/coinflip/coinflip';
import LiveBets from '../../components/liveBets/liveBets';

const CoinFlipPage: NextPage = () => {
	return <><CoinFlip /><LiveBets /></>;
};

export default CoinFlipPage;
