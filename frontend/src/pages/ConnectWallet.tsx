import React, { useState, useEffect } from "react";
import { MetaMaskInpageProvider } from "@metamask/providers";
import Ethers from "ethers";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export const ConnectWallet: React.FC = () => {
	const { address, isConnected } = useAccount();
	const { data: ensName } = useEnsName({ address });
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});

	if (isConnected) return <div>Connected to {ensName ?? address}</div>;
	return (
		<div className="hero bg-base-100">
			<div className="hero-content flex-col lg:flex-row-reverse">
				<div className="text-center lg:text-left">
					<h1 className="text-5xl font-bold">Connect To Your Wallet</h1>
					<p className="py-6">
						Connecting your wallet will allow you to accept awards from our
						casino. It also allows you to place bets with our governance token.
						Happy gambling!
					</p>
					<div className="form-control mt-6">
						<button
							onClick={() => connect()}
							className="btn btn-accent btn-wide"
						>
							Sign into metamask
						</button>
					</div>
				</div>
				{/* <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
					<div className="card-body">
						<div className="form-control">
							<label className="label">
								<span className="label-text">User</span>
							</label>
							<input
								type="text"
								placeholder="user"
								className="input input-bordered"
							/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Private Key</span>
							</label>
							<input
								type="password"
								placeholder="***********"
								className="input input-bordered"
							/>
						</div>
						<div className="form-control mt-6">
							<button className="btn btn-accent">Connect</button>
						</div>
					</div>
				</div> */}
			</div>
		</div>
	);
};
