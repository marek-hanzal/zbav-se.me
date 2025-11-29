import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { match } from "ts-pattern";
import { EventBadge } from "../../EventBadge";

export namespace RejectedEvent {
	export interface Props extends EventBadge.Props {
		//
	}
}

export const RejectedEvent: FC<RejectedEvent.Props> = (props) => {
	return (
		<EventBadge
			tone={"danger"}
			{...props}
		>
			{match(props.type)
				.with("buyer", () => {
					return <Tx label="Buyer transaction rejected (buyer) (label)" />;
				})
				.with("buyer-to-seller", () => {
					return <Tx label="Buyer transaction rejected (buyer-seller) (label)" />;
				})
				.with("seller-to-buyer", () => {
					return <Tx label="Seller transaction rejected (seller-buyer) (label)" />;
				})
				.with("seller", () => {
					return <Tx label="Seller transaction rejected (seller) (label)" />;
				})
				.with("unknown", () => {
					/**
					 * Invalid state, render nothing
					 */
					return null;
				})
				.exhaustive()}
		</EventBadge>
	);
};
