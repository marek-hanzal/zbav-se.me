import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import type { tListingTransaction } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace EpilogBadge {
	export interface Props extends Badge.Props {
		listingTransaction: tListingTransaction;
	}
}

export const EpilogBadge: FC<EpilogBadge.Props> = ({ listingTransaction, ...props }) => {
	const defaultProps: Badge.Props = {
		full: true,
		round: "default",
		size: "lg",
		tweak: {
			slot: {
				root: {
					class: [
						"my-4",
					],
				},
			},
		},
		...props,
	};

	return match(listingTransaction.status)
		.with("accepted", "request", () => {
			return null;
		})
		.with("rejected", () => {
			return (
				<Badge {...defaultProps}>
					<Tx label={"Seller rejected the transaction (label)"} />
				</Badge>
			);
		})
		.with("expired", () => {
			return (
				<Badge {...defaultProps}>
					<Tx label={"This transaction has expired (label)"} />
				</Badge>
			);
		})
		.with("success", () => {
			return (
				<Badge {...defaultProps}>
					<Tx label={"This transaction has been successfully completed (label)"} />
				</Badge>
			);
		})
		.with("closed", () => {
			return (
				<Badge {...defaultProps}>
					<Tx label={"This transaction has been closed (label)"} />
				</Badge>
			);
		})
		.exhaustive();
};
