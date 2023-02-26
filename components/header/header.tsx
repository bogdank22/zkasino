import Link from "next/link";
import { ConnectKitButton } from "connectkit";
import './header.module.scss'

const Header = () => {
  return (
    <div className="sticky top-0 p-2 flex justify-between border-b backdrop-blur-md z-50 header">
      <div className="flex gap-4 place-items-center">
        <Link className="text-white" href="/Games">
          <h1 className="hover:text-[#f8d294] font-poppins">Games</h1>
        </Link>
        <Link className="text-white" href="/Leaderboard">
          <h1 className="hover:text-[#f8d294]">Leaderboard</h1>
        </Link>
        <Link className="text-white" href="/Promotions">
          <h1 className="hover:text-[#f8d294]">Promotions</h1>
        </Link>
      </div>
      <ConnectKitButton.Custom>
        {({ isConnected, show, truncatedAddress, ensName }) => {
          return (
            <div className="connectButton" onClick={show}>
              {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
            </div>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  );
};

export default Header;
