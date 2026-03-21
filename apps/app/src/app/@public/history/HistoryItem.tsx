import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { tGitHubHistory } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";

const clamp = (value: number, min: number, max: number) => {
	return Math.max(min, Math.min(max, value));
};

/**
 * Maps a daily commit count to a palette index.
 *
 * Convention:
 * - palette[0..(n-2)] represent exact levels (0, 1, 2, ...)
 * - palette[n-1] is the overflow slot ("> max level")
 */
const getSlot = (count: number, palette: readonly string[], threshold = 5) => {
	if (palette.length <= 1) {
		return 0;
	}

	const step = Math.max(1, Math.floor(threshold));
	const overflowSlot = palette.length - 1;
	const maxLevelSlot = Math.max(0, overflowSlot - 1);
	const level = Math.floor(count / step);

	if (level > maxLevelSlot) {
		return overflowSlot;
	}

	return clamp(level, 0, maxLevelSlot);
};

export namespace HistoryItem {
	export interface Props extends Container.Props {
		item: tGitHubHistory;
		palette: readonly string[];
		/** How many commits are needed to change a color level (default: 5). */
		threshold: number;
	}
}

export const HistoryItem: FC<HistoryItem.Props> = ({
	item,
	palette,
	threshold,
	className,
	...props
}) => {
	const slot = getSlot(item.count, palette, threshold);
	const color = palette[slot] ?? palette[0] ?? "bg-transparent";

	return (
		<Container
			title={`${item.date}: ${item.count}`}
			ui={{
				square: "md",
				round: "default",
			}}
			className={[
				"flex items-center justify-center",
				"border",
				color,
				className,
			]}
			{...props}
		>
			<Typo
				label={item.count > 0 ? item.count : "-"}
				ui={{
					text: "sm",
					opacity: "6",
					font: "bold",
				}}
			/>
		</Container>
	);
};
