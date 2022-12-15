import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";

import "./Casino.scss";
import { Blackjack } from "./Blackjack";
import { Roulette } from "./Roulette";

export const Casino = () => {
	return (
		<div>
			<div className="flex gap-8"></div>

			<Routes>
				<Route path="blackjack" element={<Blackjack />} />
				<Route path="roulette" element={<Roulette />} />
			</Routes>
		</div>
	);
};
