import { render } from "ink";
import { createElement } from "react";
import { SeedApp } from "./app/SeedApp";

export const runSeedApp = async () => {
	const app = render(createElement(SeedApp), {
		alternateScreen: true,
		exitOnCtrlC: false,
	});

	await app.waitUntilExit();
};
