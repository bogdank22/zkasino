import type { NextPage } from 'next';
import { Hooka } from '../components/Hooka';

const Home: NextPage = () => {
	const isMounted = Hooka();

	return (
		<>
		</>
	);
};

export default Home;

export async function getServerSideProps(ctx: any) {
  // get the current environment
  let dev = process.env.NODE_ENV !== 'production';
  let { DEV_URL, PROD_URL } = process.env;

  // request posts from api
  let response = await fetch(`${dev ? DEV_URL : PROD_URL}/api/livebets`);
  // extract the data
  let data = await response.json();
	console.log(data);
  return {
      props: {data},
  };
}