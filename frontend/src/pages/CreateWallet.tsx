import React from "react";

export const CreateWallet: React.FC = () => {
	return (
		<div className="card card-side bg-accent shadow-xl">
			<figure>
				<img src="https://placeimg.com/200/280/arch/sepia" alt="Movie" />
			</figure>
			<div className="card-body">
				<h2 className="card-title">Create A Wallet</h2>
				<p>Click the button to create a wallet now.</p>
				<div className="card-actions justify-end">
					<button className="btn btn-outline">Create Wallet</button>
				</div>
			</div>
		</div>
	);
};
