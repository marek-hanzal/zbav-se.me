import { useCls } from "@use-pico/cls";
import { ThemeCls } from "@zbav-se.me/ui";
import type { FC } from "react";

export namespace ListingProgress {
	export interface Props {
		count: number;
		total: number;
	}
}

export const ListingProgress: FC<ListingProgress.Props> = ({
	count,
	total,
}) => {
	const { slots } = useCls(ThemeCls);

	return count > 0 ? (
		<div
			data-ui="ListingProgress-root"
			className={slots.default({
				slot: {
					default: {
						class: [
							"absolute",
							"top-2",
							"left-2",
							"right-2",
							"opacity-25",
							"z-50",
						],
						token: [
							"round.full",
						],
					},
				},
			})}
		>
			<div
				className={slots.default({
					slot: {
						default: {
							class: [
								"h-1",
								"transition-all",
							],
							token: [
								"round.full",
								"tone.primary.dark.bg",
							],
						},
					},
				})}
				style={{
					width: `${Math.min(100, 100 - (count / total) * 100)}%`,
				}}
			/>
		</div>
	) : null;
};
