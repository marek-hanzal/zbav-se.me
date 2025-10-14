import { tvc } from "@use-pico/cls";
import type { FC } from "react";

export const Background: FC = () => {
	return (
		<div
			className={tvc([
				"Background-root",
				"pointer-events-none",
				"absolute",
				"inset-0",
				"overflow-hidden",
			])}
		>
			<div
				className={tvc([
					"absolute",
					"-top-24",
					"right-[-10%]",
					"h-[36rem]",
					"w-[36rem]",
					"rounded-full",
					"bg-gradient-to-br",
					"from-indigo-500/20",
					"to-cyan-500/10",
					"blur-2xl",
				])}
			/>
			<div
				className={tvc([
					"absolute",
					"-bottom-16",
					"left-[-10%]",
					"h-[28rem]",
					"w-[28rem]",
					"rounded-full",
					"bg-gradient-to-tr",
					"from-fuchsia-500/10",
					"to-purple-500/10",
					"blur-2xl",
				])}
			/>
		</div>
	);
};
