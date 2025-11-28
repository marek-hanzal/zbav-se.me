import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { match } from "ts-pattern";
import { EventBadge } from "../../EventBadge";

export namespace AcceptedEvent {
	export interface Props extends EventBadge.Props {
		//
	}
}

export const AcceptedEvent: FC<AcceptedEvent.Props> = (props) => {
	return (
		<EventBadge {...props}>
			{match(props.type)
				.with("seller-to-buyer", () => {
					return <Tx label="Seller accepted transaction (seller-to-buyer)" />;
				})
				.with("seller", () => {
					return <Tx label="Seller accepted transaction (seller)" />;
				})
				.with("buyer", "buyer-to-seller", "unknown", () => {
					/**
					 * Invalid state, render nothing
					 */
					return null;
				})
				.exhaustive()}
		</EventBadge>
	);
};
