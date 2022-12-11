import React from "react";
import { Link } from "react-router-dom";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export const NavBar: React.FC = () => {
	const { address, isConnected } = useAccount();
	const { data: ensName } = useEnsName({ address });
	const { connect } = useConnect({
		connector: new InjectedConnector(),
	});

	const ConnectWalletLink = () => {
		if (!isConnected)
			return (
				<>
				<li>
						<Link to="/createwallet">
							<a>Create Wallet</a>
						</Link>
					</li>
				<li>
					<Link to="/connectwallet">
						<a>Connect Wallet</a>
					</Link>
				</li>
				</>
			);
	};

	return (
		<div className="navbar bg-base-100 top-nav">
			<div className="flex-1">
				<Link to="/">
					<a className="btn btn-primary normal-case text-2xl font-black">
						Dex Casino
					</a>
				</Link>
			</div>
			<div className="flex-none">
				<ul className="menu menu-horizontal px-1">
					<li tabIndex={0}>
						<a>
							Games
							<svg
								className="fill-current"
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
							>
								<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
							</svg>
						</a>
						<ul className="p-2 bg-base-100">
							<li>
								<Link to="/blackjack">
									<a>Blackjack</a>
								</Link>
							</li>
							<li>
								<Link to="/roulette">
									<a>Roulette</a>
								</Link>
							</li>
						</ul>
					</li>
					{/* <li>
						<Link to="/createwallet">
							<a>Create Wallet</a>
						</Link>
					</li> */}
					{ConnectWalletLink()}
					<li>
						<Link to="/dex">
							<a>DEX</a>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};
