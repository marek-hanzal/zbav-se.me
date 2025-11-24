import type { Badge } from "@use-pico/client/ui/badge";
import type { tListingTransactionSideEnum, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC, ReactNode } from "react";
import { match } from "ts-pattern";

export namespace EventBadge {
	export namespace Render {
		export interface Props extends Badge.Props {
			//
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props extends Badge.Props {
		/**
		 * Current user (or required point of view)
		 */
		side: tUserSideEnum;
		/**
		 * Who did the change?
		 */
		actor: tListingTransactionSideEnum;
		/**
		 * Seller side (seller views, seller acted)
		 */
		renderSellerFn: Render.RenderFn | undefined;
		/**
		 * Buyer side (buyer views, buyer acted)
		 */
		renderBuyerFn: Render.RenderFn | undefined;
		/**
		 * Buyer acted, seller views
		 */
		renderBuyerToSellerFn: Render.RenderFn | undefined;
		/**
		 * Seller acted, buyer views
		 */
		renderSellerToBuyerFn: Render.RenderFn | undefined;
	}

	export type PropsEx = Omit<
		Props,
		"renderSellerFn" | "renderBuyerFn" | "renderBuyerToSellerFn" | "renderSellerToBuyerFn"
	>;
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
	...props
}) => {
	const defaultProps: Badge.Props = {
		round: "default",
		...props,
	};

	if (side === "seller" && side === actor) {
		return renderSellerFn?.(defaultProps);
	}

	if (side === "seller" && actor === "buyer") {
		return renderBuyerToSellerFn?.(defaultProps);
	}

	return match(side)
		.with("buyer", () => {
			if (side === actor) {
				return renderBuyerFn?.(defaultProps);
			}

			if (actor === "seller") {
				return renderSellerToBuyerFn?.(defaultProps);
			}

			return `unknown ${side} -> ${actor}`;
		})
		.with("seller", () => {
			if (side === actor) {
				return renderSellerFn?.(defaultProps);
			}

			if (actor === "buyer") {
				return renderBuyerToSellerFn?.(defaultProps);
			}

			return `unknown ${side} -> ${actor}`;
		})
		.exhaustive();
};
