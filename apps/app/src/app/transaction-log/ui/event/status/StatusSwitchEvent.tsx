import type { tTransactionStatus, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import type { useSideSwitch } from "~/app/transaction/ui/useSideSwitch";
import { AcceptedEvent } from "./AcceptedEvent";
import { RejectedEvent } from "./RejectedEvent";
import { RequestEvent } from "./RequestEvent";

export namespace StatusSwitchEvent {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		type: useSideSwitch.Type;
		transactionStatus: tTransactionStatus;
		isCurrent: boolean;
		isClosed: boolean;
	}
}

export const StatusSwitchEvent: FC<StatusSwitchEvent.Props> = ({
	locale,
	side,
	type,
	transactionStatus,
	isCurrent,
	isClosed,
}) => {
	return match(transactionStatus.status)
		.with("request", () => {
			return (
				<RequestEvent
					locale={locale}
					side={side}
					actor={transactionStatus.side}
					type={type}
					timestamp={transactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("accepted", () => {
			return (
				<AcceptedEvent
					locale={locale}
					side={side}
					actor={transactionStatus.side}
					type={type}
					timestamp={transactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("rejected", () => {
			return (
				<RejectedEvent
					locale={locale}
					side={side}
					actor={transactionStatus.side}
					type={type}
					timestamp={transactionStatus.createdAt}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("closed", "expired", "success", () => {
			return "not-yet";
		})
		.exhaustive();
};
