import React from "react";

export const ConnectWallet: React.FC = () => {
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
				</div>
				<div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
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
							{/* <label className="label">
								<a href="#" className="label-text-alt link link-hover">
									Forgot password?
								</a>
							</label> */}
						</div>
						<div className="form-control mt-6">
							<button className="btn btn-accent">Connect</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
