import type { NextPage } from 'next';
import Slot from '../../components/slot/slot';
import LiveBets from '../../components/liveBets/liveBets';

const SlotPage: NextPage = () => {
	return <>
		<Slot />
		<LiveBets />
	</>;
};

export default SlotPage;
