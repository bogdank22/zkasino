import type { NextPage } from 'next';
import Slot from '../components/slot/slot';
import LiveBets from '../components/liveBets/liveBets';

const Home: NextPage = () => {
  return (
    <>
      <Slot />
      <LiveBets />
    </>
  );
};

export default Home;
