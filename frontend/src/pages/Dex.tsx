import { useEffect, useState } from "react";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

interface Token {
	chainId: number;
	address: string;
	name: string;
	symbol: string;
	decimals: number;
	logoURI: string;
}

interface TokensResponse {
	name: "string";
	logoURI: "string";
	keywords: any[];
	timestamp: string;
	tokens: Token[];
	version: any;
}

export const Dex = () => {
	const { address, isConnected } = useAccount();
	const { data: ensName } = useEnsName({ address });
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});

	const [convertFrom, setConvertFrom] = useState<Token | undefined>(undefined);
	const [convertTo, setConvertTo] = useState<Token | undefined>(undefined);
	const [tokens, setTokens] = useState<Token[] | undefined>(undefined);
	const [convertFromAmount, setConvertFromAmount] = useState<
		number | undefined
	>(undefined);
	const [convertBuyAmount, setConvertBuyAmount] = useState<number | undefined>(
		undefined
	);
	const [estimatedGas, setEstimatedGas] = useState<number | undefined>(
		undefined
	);

	const getSwapPrice = async (buyAmount: any) => {
		if (!convertFromAmount || !convertFrom || !convertTo) return;
		try {
			const amount = convertFromAmount * 10 ** convertFrom.decimals;
			const response = await fetch(
				`https://api.0x.org/swap/v1/price?sellToken=${convertFrom.address}&buyToken=${convertTo.address}&sellAmount=${amount}`
			);
			const swapPriceJson = await response.json();
			setConvertBuyAmount(swapPriceJson.buyAmount / 10 ** convertTo.decimals);
			setEstimatedGas(swapPriceJson.estimatedGas);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const getData = async () => {
			try {
				const response = await fetch(
					`https://tokens.coingecko.com/uniswap/all.json`
				);
				let { tokens } = (await response.json()) as TokensResponse;
				tokens = tokens.slice(0, 10);
				setTokens(tokens);
			} catch (error) {
				console.error(error);
			}
		};
		getData();
	}, []);

	let swapSubmit = (
		<>
			<p className="font-bold">No wallet connected</p>
			<div className="card-actions justify-center">
				<button className="btn btn-block btn-outline btn-lg normal-case btn-disabled">
					Swap
				</button>
			</div>
		</>
	);

	const tokenOptions = (() => {
		if (!tokens) return <></>;
		return (
			<>
				{tokens.map((token) => (
					<option key={token.address} value={token.address}>
						{token.symbol}
					</option>
				))}
			</>
		);
	})();

	if (isConnected) {
		swapSubmit = (
			<>
				<p className="font-bold">Estimated Gas: {estimatedGas}</p>
				<div className="card-actions justify-center">
					<button className="btn btn-block btn-outline btn-lg normal-case">
						Swap
					</button>
				</div>
			</>
		);
	}
	return (
		<div className="card w-96 bg-accent shadow-xl glass">
			<figure>
				<img src="https://placeimg.com/400/50/arch/sepia" alt="Shoes" />
			</figure>
			<div className="card-body grow-0 form-control">
				<label className="input-group input-group-md justify-start">
					<input
						type="string"
						onChange={(e) => {
							setConvertFromAmount(Number(e.target.value));
							console.log("gfoihrgeg", convertFromAmount);
							getSwapPrice(convertFromAmount);
						}}
						placeholder="sell"
						className="input w-full input-bordered"
					/>
					<select
						className="select select-bordered"
						onChange={(e) =>
							setConvertFrom(tokens![e.target.selectedIndex - 1])
						}
					>
						<option disabled selected>
							Pick token
						</option>
						{tokenOptions}
					</select>
				</label>
				<label className="input-group input-group-md justify-end">
					<select
						className="select select-bordered"
						onChange={(e) => setConvertTo(tokens![e.target.selectedIndex - 1])}
					>
						<option disabled selected>
							Pick token
						</option>
						{tokenOptions}
					</select>
					<input
						type="text"
						placeholder={
							convertFromAmount
								? JSON.stringify(convertBuyAmount)
								: "buy amount"
						}
						className="input w-full input-bordered"
						disabled
					/>
				</label>
				{swapSubmit}
			</div>
		</div>
	);
};
