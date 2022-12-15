import { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { roulettePockets } from "../../assets/rouletteBoard";
import { getRandomRoulettePocket } from "../../utils/getRandom";

interface DisplayStats {
	winningNumber: string;
	reward: number;
	winningColor: string;
	winningParity: string;
}

export const Roulette = () => {
	const [mustSpin, setMustSpin] = useState(false);
	const [winningIndex, setWinningIndex] = useState(0);
	const [gameStats, setGameStats] = useState<DisplayStats | undefined>();
	const [chosenPocket, choosePocket] = useState<string | undefined>();
	const [autoChoose, setAutoChoose] = useState(false);
	const [win, setWinner] = useState(false);
	const [betAmount, setBetAmount] = useState(0);

	const textColor = () => {
		if (!chosenPocket) return "";
		if (parseInt(chosenPocket) > 36 || parseInt(chosenPocket) < 0) {
			return "text-red-500";
		} else return "";
	};

	const handleChange = () => {
		const checkBoxBeforeEvent = autoChoose;
		setAutoChoose(!autoChoose);
		checkBoxBeforeEvent
			? choosePocket(undefined)
			: choosePocket(getRandomRoulettePocket().toString());
	};

	return (
		<>
			{win ? (
				<div className="alert alert-success shadow-lg m-5">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>We have a winner!</span>
					</div>
				</div>
			) : (
				<></>
			)}

			<div className="card flex flex-row">
				<div
					className={
						"stats stats-vertical shadow rounded-2xl border-4 border-primary"
					}
				>
					<div className="stat">
						<div className={"stat-title text-primary"}>Winning Number</div>
						<div className="stat-value text-primary pb-2">
							{gameStats ? gameStats.winningNumber : "__"}
						</div>
						<div className="stat-desc">
							{gameStats
								? `Parity: ${gameStats.winningParity.toUpperCase()}`
								: "Spin to Play"}
						</div>
						<div className="stat-desc">
							{gameStats
								? `Color: ${gameStats.winningColor.toUpperCase()}`
								: ""}
						</div>
					</div>
					<div className="stat">
						<input
							type="text"
							placeholder={autoChoose ? chosenPocket : "Enter winning number"}
							className={
								"input input-bordered input-primary w-full max-w-xs " +
								textColor()
							}
							disabled={autoChoose}
							onChange={({ target: { value } }) => {
								if (0 <= parseInt(value) && parseInt(value) <= 36) {
									choosePocket(value);
								} else {
									choosePocket(undefined);
								}
							}}
						/>
						<div className="divider">OR</div>
						<div className="form-control">
							<label className="label cursor-pointer">
								<span className="label-text text-secondary">
									I'm feeling lucky!
								</span>
								<input
									type="checkbox"
									className="checkbox"
									checked={autoChoose}
									onChange={() => {
										choosePocket(undefined);
										handleChange();
									}}
								/>
							</label>
						</div>
					</div>

					<div className="stat">
						<div className="stat-title">Bet Secured</div>
						<div className="stat-value">{betAmount} DEX</div>
						<div className="stat-actions">
							<button
								className="btn btn-sm btn-secondary"
								onClick={() => setBetAmount(betAmount + 1)}
							>
								Increase bet
							</button>
						</div>
					</div>
				</div>
				<div className="game-card flex flex-col ml-5 items-center">
					<Wheel
						mustStartSpinning={mustSpin}
						perpendicularText={true}
						data={roulettePockets}
						prizeNumber={winningIndex}
						textColors={["white"]}
						outerBorderWidth={10}
						outerBorderColor={"#3d251e"}
						innerBorderWidth={40}
						innerBorderColor={"#3d251e"}
						innerRadius={45}
						textDistance={90}
						radiusLineWidth={0}
						onStopSpinning={() => {
							setMustSpin(false);
							const gameStats = {
								winningNumber: roulettePockets[winningIndex].option,
								winningColor:
									roulettePockets[winningIndex].style.backgroundColor,
								winningParity: !(
									parseInt(roulettePockets[winningIndex].option) % 2
								)
									? "even"
									: "odd",
								reward: 180,
							};
							setGameStats(gameStats);
							if (gameStats.winningNumber === chosenPocket) setWinner(true);
              setBetAmount(0);
						}}
					/>

					<button
						className="btn btn-wide btn-primary"
						onClick={() => {
							setWinningIndex(getRandomRoulettePocket());
							setMustSpin(true);
						}}
						disabled={!chosenPocket || betAmount === 0}
					>
						SPIN
					</button>
				</div>
			</div>
		</>
	);
};