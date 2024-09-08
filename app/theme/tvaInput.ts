import { tva } from "~/theme/tva";

export const tvaInput = tva({
	slots: {
		base: ["py-2"],
		label: ["block", "text-xl", "text-orange-900"],
		input: [
			"w-full",
			"border-2",
			"border-orange-500",
			"bg-orange-50",
			"rounded-md",
			"px-3",
			"py-2",
			"text-slate-900",
			"focus:outline-none",
			"focus:border-amber-500",
			"focus:bg-amber-50",
		],
	},
});
