import {
	type tListingTransactionLog,
	type tUserSideEnum,
	zListingTransactionGallery,
	zListingTransactionMessage,
	zListingTransactionStatus,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { useSideSwitch } from "~/app/listing-transaction/ui/useSideSwitch";
import { GalleryEvent } from "./event/gallery/GalleryEvent";
import { MessageEvent } from "./event/message/MessageEvent";
import { StatusSwitchEvent } from "./event/status/StatusSwitchEvent";

export namespace TransactionLogItem {
	export interface Props {
		locale: string;
		side: tUserSideEnum;
		listingTransactionLog: tListingTransactionLog;
		isCurrent: boolean;
		isClosed: boolean;
	}
}

export const TransactionLogItem: FC<TransactionLogItem.Props> = ({
	locale,
	side,
	listingTransactionLog,
	isCurrent,
	isClosed,
}) => {
	const { type } = useSideSwitch({
		actor: listingTransactionLog.side,
		side,
	});

	return match(listingTransactionLog.event)
		.with("status", () => {
			const status = zListingTransactionStatus.parse(listingTransactionLog);

			return (
				<StatusSwitchEvent
					locale={locale}
					side={side}
					type={type}
					listingTransactionStatus={status}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("message", () => {
			const message = zListingTransactionMessage.parse(listingTransactionLog);

			return (
				<MessageEvent
					locale={locale}
					side={side}
					type={type}
					listingTransactionMessage={message}
					isCurrent={isCurrent}
					isClosed={isClosed}
				/>
			);
		})
		.with("gallery", () => {
			const gallery = zListingTransactionGallery.parse(listingTransactionLog);

			return (
				<GalleryEvent
					locale={locale}
					side={side}
					type={type}
					listingTransactionGallery={gallery}
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
