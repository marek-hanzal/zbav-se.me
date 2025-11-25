import type { tListingTransactionLog } from "@zbav-se.me/sdk/api/user";
import { type FC } from "react";
import { match } from "ts-pattern";
import { StatusMenu } from "./event/status/StatusMenu";

export namespace ContextMenu {
	export interface Props {
		transactionLog: tListingTransactionLog;
	}
}

export const ContextMenu: FC<ContextMenu.Props> = ({ transactionLog }) => {
	return match(transactionLog.event)
		.with("status", () => {
			return <StatusMenu />;
		})
		.with("gallery", "location", "message", () => {
			return null;
		})
		.exhaustive();
};
