import { Container } from "@use-pico/client/ui/container";
import type { tGitHubHistory } from "@zbav-se.me/sdk/api/public";

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
const getSlot = (count: number, palette: readonly string[]) => {
	if (palette.length <= 1) {
		return 0;
	}

	const overflowSlot = palette.length - 1;
	const maxLevelSlot = Math.max(0, overflowSlot - 1);
	const level = Math.floor(count);

	if (level > maxLevelSlot) {
		return overflowSlot;
	}

	return clamp(level, 0, maxLevelSlot);
};

export namespace HistoryItem {
	export interface Props extends Container.Props {
		item: tGitHubHistory;
		palette: readonly string[];
	}
}

export const HistoryItem = ({ item, palette, className, ...props }: HistoryItem.Props) => {
	const slot = getSlot(item.count, palette);
	const color = palette[slot] ?? palette[0] ?? "bg-transparent";

	return (
		<Container
			title={`${item.date}: ${item.count}`}
			ui={{
				round: "default",
			}}
			className={[
				// "w-1",
				// "h-1",
				"border border-slate-200",
				color,
				className,
			]}
			{...props}
		/>
	);
};
