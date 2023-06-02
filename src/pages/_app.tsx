import '@/styles/globals.css'
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { sepolia } from "wagmi/chains";
import {
  darkTheme,
} from "@rainbow-me/rainbowkit";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const alchemyId = process.env.NEXT_PUBLIC_POLYGON_ALCHEMY_ID;

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://eth-sepolia.g.alchemy.com/v2/${alchemyId}`,
        webSocket: `wss://eth-sepolia.g.alchemy.com/v2/${alchemyId}`,
      }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Web3Bridge DAO",
  projectId: 'W3B-DAO-1',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: "#6938EF",
        })}
      >
        <ToastContainer />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>

  )
}
