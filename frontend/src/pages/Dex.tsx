import React from "react";

type DexProps = {
	walletConnected: boolean;
};

export const Dex = ({ walletConnected = true }: DexProps) => {
	let estimatedGas = 10000000;
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
	if (walletConnected) {
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
				<div className="card-body grow-0">
					<label className="input-group input-group-md justify-start">
						<span>TOKEN</span>
						<select className="select select-bordered">
							<option disabled selected>
								Pick token
							</option>
							<option>Volcano Coin</option>
							<option>Dirt Coin</option>
						</select>
					</label>
					<label className="input-group input-group-md justify-end">
						<select className="select select-bordered">
							<option disabled selected>
								Pick token
							</option>
							<option>Volcano Coin</option>
							<option>Dirt Coin</option>
						</select>
						<span>TOKEN</span>
					</label>
					{swapSubmit}
				</div>
			</div>
	);
};
