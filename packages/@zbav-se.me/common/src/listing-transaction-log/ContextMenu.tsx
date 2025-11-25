import type { tListingTransactionLog, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { StatusMenu } from "./event/status/StatusMenu";

export namespace ContextMenu {
	export interface Props {
		side: tUserSideEnum;
		log: tListingTransactionLog;
	}
}

export const ContextMenu: FC<ContextMenu.Props> = ({ side, log }) => {
	return match(log.event)
		.with("status", () => {
			return (
				<StatusMenu
					side={side}
					log={log}
				/>
			);
		})
		.with("gallery", "location", "message", () => {
			return null;
		})
		.exhaustive();
};
