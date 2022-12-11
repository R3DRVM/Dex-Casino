import React from "react";
import "./App.css";
// import { Route, Switch } from "wouter";
import { Routes, Route } from "react-router-dom";
import {
	Blackjack,
	ConnectWallet,
	CreateWallet,
	Dex,
	Roulette,
	PageNotFound,
} from "./pages";
import { NavBar } from "./Components";
import { WagmiConfig, configureChains, mainnet, createClient } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
	[mainnet],
	[publicProvider()]
);

const client = createClient({
	autoConnect: true,
	provider,
	webSocketProvider,
});

const App: React.FC = () => {
	return (
		<WagmiConfig client={client}>
			<div
				data-theme="myTheme"
				className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center"
			>
				<NavBar />
				<main className="p-10 flex flex-row grow items-center justify-center">
					<Routes>
						{/* <Route path="/roulette" element={<Roulette />} /> */}
						<Route path="/roulette" element={<Roulette />} />
						<Route path="/blackJack" element={<Blackjack />} />
						<Route path="/connectwallet" element={<ConnectWallet />} />
						<Route path="/createwallet" element={<CreateWallet />} />
						<Route path="/dex/" element={<Dex />} />
						{/* <Route path="*" element={<PageNotFound />} /> */}
					</Routes>
				</main>
			</div>
		</WagmiConfig>
	);
};

export default App;
