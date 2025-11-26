import type { Badge, BadgeCls } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import type { Cls } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import type { FC, ReactNode } from "react";
import { useSideSwitch } from "../listing-transaction/useSideSwitch";

export namespace EventBadge {
	export interface Props
		extends Badge.Props,
			useSideSwitch.Props<
				Badge.Props & {
					timestamp: ReactNode;
				}
			> {
		locale: string;
		timestamp: string;
		isCurrent: boolean;
		isClosed: boolean;
	}
}

/**
 * This is a base component for all transaction log items (events).
 *
 * Render functions have intentionally | undefined so implementation _explicitly_ disables certain (eventually
 * invalid) combinations.
 *
 * This component by default expects "Badge" component being rendered, but it does not matter.
 */
export const EventBadge: FC<EventBadge.Props> = ({
	locale,
	timestamp,
	isCurrent,
	isClosed,
	side,
	actor,
	renderSellerFn,
	renderBuyerFn,
	renderBuyerToSellerFn,
	renderSellerToBuyerFn,
	tweak,
	...props
}) => {
	const isCurrentClosed = isClosed && isCurrent;

	const typeTweaks: Partial<Record<useSideSwitch.Type, Cls.TweaksOf<BadgeCls>>> = {
		buyer: {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: [
								"items-end",
								"ml-auto",
							],
				},
			},
		},
		"buyer-to-seller": {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: undefined,
				},
			},
		},
		seller: {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: [
								"items-end",
								"ml-auto",
							],
				},
			},
		},
		"seller-to-buyer": {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: undefined,
				},
			},
		},
	};

	const typeProps: Partial<Record<useSideSwitch.Type, Badge.Props>> = {
		buyer: {
			tone: isCurrentClosed ? "neutral" : "secondary",
		},
		seller: {
			tone: isCurrentClosed ? "neutral" : "secondary",
		},
		"seller-to-buyer": {
			tone: isCurrentClosed ? "neutral" : "secondary",
		},
		"buyer-to-seller": {
			tone: isCurrentClosed ? "neutral" : "secondary",
		},
	};

	const badgeTweak: Cls.TweaksOf<BadgeCls> = {
		slot: {
			root: {
				class: [
					"h-fit",
					"flex",
					"flex-col",
					"items-start",
					"gap-1",
					"px-2",
					"py-1",
					"w-6/8",
					"max-w-5/6",
					"transition-all",
					isCurrentClosed
						? [
								"mx-auto",
								"w-full",
								"max-w-full",
								"my-2",
							]
						: undefined,
				],
				token: isCurrent
					? [
							"shadow.lg",
						]
					: undefined,
			},
		},
	};

	const defaultProps: Badge.Props = {
		round: "default",
		...props,
	};

	const { type, render } = useSideSwitch({
		side,
		actor,
		renderSellerFn,
		renderBuyerFn,
		renderBuyerToSellerFn,
		renderSellerToBuyerFn,
	});

	return render?.({
		...defaultProps,
		...typeProps[type],
		tweak: [
			tweak,
			badgeTweak,
			typeTweaks[type],
		],
		timestamp: (
			<Typo
				label={toTimeDiff({
					locale,
					time: timestamp,
				})}
				font={"normal"}
				size={"sm"}
			/>
		),
	});
};
