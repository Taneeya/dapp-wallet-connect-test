"use client";

import React, { useEffect, useState } from "react";
import {
  WagmiProvider,
  createConfig,
  useConnection,
  useConnections,
  useConnect,
  useConnectors,
  useDisconnect,
} from "wagmi";
import { mainnet } from "viem/chains";
import { http } from "viem";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const chains = [mainnet] as const;

const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "",
      qrModalOptions: {
        themeMode: "dark",
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

function Inner() {
  const { address, isConnected, connector: activeConnector } = useConnection();
  const { error, status, variables } = useConnect();
  const connectors = useConnectors();
  const connect = useConnect();
  const { disconnect } = useDisconnect();
  const [output, setOutput] = useState<string | null>(null);

  const getProvider = async (): Promise<any> => {
    return (activeConnector as any)?.getProvider?.() ?? null;
  };

  const request = async (method: string, params?: any[]) => {
    setOutput("pending...");
    try {
      const provider = await getProvider();
      if (!provider?.request) throw new Error("No provider available");
      const res = await provider.request({ method, params: params ?? [] });
      setOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setOutput(String(err?.message ?? err));
    }
  };

  const sendETH = async () => {
    if (!address) return setOutput("Not connected");
    // example: send 0.001 ETH to same address (wallet may ask for approval)
    const tx = {
      from: address,
      to: address,
      value: "0x3635C9ADC5DEA0000", // 0.1 ETH (hex) — change as needed
    };
    await request("eth_sendTransaction", [tx]);
  };

  const switchEthereumChain = async () => {
    await request("wallet_switchEthereumChain", [{ chainId: "0x1" }]); // switch to mainnet
  };

  const addEthereumChain = async () => {
    const chain = {
      chainId: "0x89", // polygon
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
      rpcUrls: ["https://rpc.ankr.com/polygon"],
      blockExplorerUrls: ["https://polygonscan.com"],
    };
    await request("wallet_addEthereumChain", [chain]);
  };

  const personalSign = async () => {
    if (!address) return setOutput("Not connected");
    const message = "Hello from dApp (personal_sign)";
    await request("personal_sign", [message, address]);
  };

  const ethSign = async () => {
    if (!address) return setOutput("Not connected");
    const message = "Hello from dApp (eth_sign)";
    await request("eth_sign", [address, message]);
  };

  const signTypedDataV1 = async () => {
    if (!address) return setOutput("Not connected");
    const data = [
      { type: "string", name: "Message", value: "Hello Typed Data v1" },
    ];
    setOutput("pending...");
    try {
      const provider = await getProvider();
      if (!provider?.request) throw new Error("No provider available");

      const tryCall = async (method: string, params: any[]) => {
        return provider.request({ method, params });
      };

      // try [address, data]
      try {
        const res = await tryCall("eth_signTypedData", [address, data]);
        return setOutput(JSON.stringify(res, null, 2));
      } catch (err1: any) {
        // try [data, address]
        try {
          const res = await tryCall("eth_signTypedData", [data, address]);
          return setOutput(JSON.stringify(res, null, 2));
        } catch (err2: any) {
          // try explicit v1
          try {
            const res = await tryCall("eth_signTypedData_v1", [address, data]);
            return setOutput(JSON.stringify(res, null, 2));
          } catch (err3: any) {
            return setOutput(String(err3?.message ?? err3));
          }
        }
      }
    } catch (err: any) {
      setOutput(String(err?.message ?? err));
    }
  };

  const signTypedDataV3 = async () => {
    if (!address) return setOutput("Not connected");
    const typedData = {
      domain: { name: "Example" },
      message: { contents: "Hello Typed Data v3" },
      primaryType: "Message",
      types: {
        EIP712Domain: [{ name: "name", type: "string" }],
        Message: [{ name: "contents", type: "string" }],
      },
    };
    await request("eth_signTypedData_v3", [address, JSON.stringify(typedData)]);
  };

  const signTypedDataV4 = async () => {
    if (!address) return setOutput("Not connected");
    const typedData = {
      domain: { name: "Example" },
      message: { contents: "Hello Typed Data v4" },
      primaryType: "Message",
      types: {
        EIP712Domain: [{ name: "name", type: "string" }],
        Message: [{ name: "contents", type: "string" }],
      },
    };
    await request("eth_signTypedData_v4", [address, JSON.stringify(typedData)]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {!isConnected ? (
          <>
            {connectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => connector.connect()}
                className="rounded-md bg-black text-white px-3 py-2 text-sm"
              >
                Connect {connector.name}
                {status === "pending" &&
                (variables?.connector as any)?.id === connector.id
                  ? "…"
                  : ""}
              </button>
            ))}
            {error && (
              <div className="text-sm text-red-500">{error.message}</div>
            )}
          </>
        ) : (
          <>
            <div className="text-sm">Connected: {address}</div>
            <button
              onClick={() => disconnect()}
              className="rounded-md border px-3 py-2 text-sm"
            >
              Disconnect
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={sendETH}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Send ETH
        </button>
        <button
          onClick={switchEthereumChain}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Switch Chain
        </button>
        <button
          onClick={addEthereumChain}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Add Chain
        </button>
        <button
          onClick={personalSign}
          className="rounded-md border px-3 py-2 text-sm"
        >
          personal_sign
        </button>
        <button
          onClick={ethSign}
          className="rounded-md border px-3 py-2 text-sm"
        >
          eth_sign
        </button>
        <button
          onClick={signTypedDataV1}
          className="rounded-md border px-3 py-2 text-sm"
        >
          signTypedData (v1)
        </button>
        <button
          onClick={signTypedDataV3}
          className="rounded-md border px-3 py-2 text-sm"
        >
          signTypedData_v3
        </button>
        <button
          onClick={signTypedDataV4}
          className="rounded-md border px-3 py-2 text-sm"
        >
          signTypedData_v4
        </button>
      </div>

      <div className="mt-2">
        <div className="text-sm font-medium">Result</div>
        <pre className="text-xs bg-gray-100 p-2 rounded">{output ?? "—"}</pre>
      </div>
    </div>
  );
}

export default function DappFunc() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Inner />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
