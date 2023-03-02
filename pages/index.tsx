import type { NextPage } from 'next';
import Slot from '../components/slot/slot';
import LiveBets from '../components/liveBets/liveBets';
import { Hooka } from '../components/Hooka';
const Home: NextPage = () => {
  const isMounted = Hooka();

  return (
    <>
    {isMounted && 
    <>
      <Slot />
      <LiveBets />
      </>
    }

    </>
  );
};

export default Home;
