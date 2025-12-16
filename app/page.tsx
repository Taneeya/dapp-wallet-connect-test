"use client";
import DappFunc from "./components/dappFunc";
// import WalletConnectModal from "./components/walletConnect";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="text-lg font-semibold">Dapp-test</div>
        <div className="wallet-connect flex gap-2">
          <DappFunc />
        </div>
        <div>{/* <WalletConnectModal /> */}</div>
        {/* <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/detail"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Detail test
          </Link>
        </div> */}
      </main>
    </div>
  );
}
