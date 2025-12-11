import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { match } from "ts-pattern";
import { EventBadge } from "../../EventBadge";

export namespace RequestEvent {
	export interface Props extends EventBadge.Props {
		//
	}
}

export const RequestEvent: FC<RequestEvent.Props> = (props) => {
	return (
		<EventBadge {...props}>
			{match(props.type)
				.with("buyer", () => {
					return <Tx label="Buyer transaction request (buyer-buyer) (label)" />;
				})
				.with("buyer-to-seller", () => {
					return <Tx label="Buyer transaction request (buyer-seller) (label)" />;
				})
				.with("seller", () => {
					return <Tx label="Seller transaction request (seller-seller) (label)" />;
				})
				.with("seller-to-buyer", "unknown", () => {
					/**
					 * Invalid state, render nothing
					 */
					return null;
				})
				.exhaustive()}
		</EventBadge>
	);
};
