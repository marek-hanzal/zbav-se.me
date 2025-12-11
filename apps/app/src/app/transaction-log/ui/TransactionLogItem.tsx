import {
	type tTransactionLog,
	type tUserSideEnum,
	zTransactionGallery,
	zTransactionMessage,
	zTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useSideSwitch } from "~/app/transaction/ui/useSideSwitch";
import { GalleryEvent } from "./event/gallery/GalleryEvent";
import { MessageEvent } from "./event/message/MessageEvent";
import { StatusSwitchEvent } from "./event/status/StatusSwitchEvent";

export namespace TransactionLogItem {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		transactionLog: tTransactionLog;
		isCurrent: boolean;
		isClosed: boolean;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	locale,
	side,
	transactionLog,
	isCurrent,
	isClosed,
}) => {
	const { type } = useSideSwitch({
		actor: transactionLog.side,
		side,
	});

	return match(transactionLog.event)
		.with("status", () => {
			const status = zTransactionStatus.parse(transactionLog);

			return (
				<StatusSwitchEvent
					locale={locale}
					side={side}
					type={type}
					transactionStatus={status}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("message", () => {
			const message = zTransactionMessage.parse(transactionLog);

			return (
				<MessageEvent
					locale={locale}
					side={side}
					type={type}
					transactionMessage={message}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("gallery", () => {
			const gallery = zTransactionGallery.parse(transactionLog);

			return (
				<GalleryEvent
					locale={locale}
					side={side}
					type={type}
					transactionGallery={gallery}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("location", () => {
			return "not-yet";
		})
		.exhaustive();
};
