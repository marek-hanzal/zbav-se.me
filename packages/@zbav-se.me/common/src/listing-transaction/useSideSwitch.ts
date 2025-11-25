import type { tListingTransactionSideEnum, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { ReactNode } from "react";
import { match } from "ts-pattern";

export namespace useSideSwitch {
	export type Type = "buyer" | "seller" | "buyer-to-seller" | "seller-to-buyer" | "unknown";

	export namespace Render {
		export type RenderFn<TProps extends object> = (props: TProps) => ReactNode;
	}

	export interface Props<TProps extends object> {
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
		renderSellerFn: Render.RenderFn<TProps> | undefined;
		/**
		 * Buyer side (buyer views, buyer acted)
		 */
		renderBuyerFn: Render.RenderFn<TProps> | undefined;
		/**
		 * Buyer acted, seller views
		 */
		renderBuyerToSellerFn: Render.RenderFn<TProps> | undefined;
		/**
		 * Seller acted, buyer views
		 */
		renderSellerToBuyerFn: Render.RenderFn<TProps> | undefined;
	}

	export type PropsEx<TProps extends object> = Omit<
		Props<TProps>,
		"renderSellerFn" | "renderBuyerFn" | "renderBuyerToSellerFn" | "renderSellerToBuyerFn"
	>;

	export interface Result<TProps extends object> {
		type: Type;
		render: Render.RenderFn<TProps> | undefined;
	}
}

/**
 * Hook which contains logic for switching between different render functions
 * based on side and actor.
 */
export const useSideSwitch = <TProps extends object>({
	side,
	actor,
	renderSellerFn,
	renderBuyerFn,
	renderBuyerToSellerFn,
	renderSellerToBuyerFn,
}: useSideSwitch.Props<TProps>): useSideSwitch.Result<TProps> => {
	return match(side)
		.with("buyer", () => {
			if (side === actor) {
				return {
					type: "buyer",
					render: renderBuyerFn,
				} as const;
			}

			if (actor === "seller") {
				return {
					type: "seller-to-buyer",
					render: renderSellerToBuyerFn,
				} as const;
			}

			return {
				type: "unknown",
				render: undefined,
			} as const;
		})
		.with("seller", () => {
			if (side === actor) {
				return {
					type: "seller",
					render: renderSellerFn,
				} as const;
			}

			if (actor === "buyer") {
				return {
					type: "buyer-to-seller",
					render: renderBuyerToSellerFn,
				} as const;
			}

			return {
				type: "unknown",
				render: undefined,
			} as const;
		})
		.exhaustive();
};
