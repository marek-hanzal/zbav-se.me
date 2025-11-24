import type { Badge, BadgeCls } from "@use-pico/client/ui/badge";
import type { Cls } from "@use-pico/cls";
import type { FC } from "react";
import { useSideSwitch } from "../listing-transaction/useSideSwitch";

const typeTweaks: Partial<Record<useSideSwitch.Type, Cls.TweaksOf<BadgeCls>>> = {
	buyer: {
		slot: {
			root: {
				class: [
					"items-end",
					"ml-auto",
				],
			},
		},
	},
};
const typeProps: Partial<Record<useSideSwitch.Type, Badge.Props>> = {
	"seller-buyer": {
		tone: "secondary",
	},
	"buyer-seller": {
		tone: "secondary",
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
				// "bg-transparent",
				"border-none",
			],
		},
	},
};

export namespace EventBadge {
	export interface Props extends Badge.Props, useSideSwitch.Props<Badge.Props> {}

	export type PropsEx = Badge.Props & useSideSwitch.PropsEx<Badge.Props>;
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
	side,
	actor,
	renderSellerFn,
	renderBuyerFn,
	renderBuyerToSellerFn,
	renderSellerToBuyerFn,
	tweak,
	...props
}) => {
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
	});
};
