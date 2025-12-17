import { Container } from "@use-pico/client/ui/container";
import type { tGitHubHistory } from "@zbav-se.me/sdk/api/public";

const clamp = (value: number, min: number, max: number) => {
	return Math.max(min, Math.min(max, value));
};

const getSlot = (count: number) => {
	if (count > 10) {
		return 11;
	}

	return clamp(Math.floor(count), 0, 10);
};

export namespace HistoryItem {
	export interface Props extends Container.Props {
		item: tGitHubHistory;
		palette: readonly string[];
	}
}

export const HistoryItem = ({ item, palette, className, ...props }: HistoryItem.Props) => {
	const slot = getSlot(item.count);
	const color = palette[slot] ?? palette[0] ?? "bg-transparent";

	return (
		<Container
			title={`${item.date}: ${item}`}
			ui={{
				square: "md",
				round: "default",
			}}
			className={[
				"border border-slate-200",
				color,
				className,
			]}
			{...props}
		/>
	);
};
