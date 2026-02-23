import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import {
	zMessageGallery,
	type zMessageItem,
	zMessageLocation,
	zMessagePackage,
	zMessagePersonal,
	zMessageSystem,
	zMessageText,
} from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageGallery } from "~/app/@common/message/type/MessageGallery";
import { MessageLocation } from "~/app/@common/message/type/MessageLocation";
import { MessagePackage } from "~/app/@common/message/type/MessagePackage";
import { MessagePersonal } from "~/app/@common/message/type/MessagePersonal";
import { MessageText } from "~/app/@common/message/type/MessageText";

export namespace MessageRenderItem {
	export interface Props {
		side: tUserSideEnum;
		message: zMessageItem;
	}
}

export const MessageRenderItem: FC<MessageRenderItem.Props> = ({ side, message }) => {
	return match(message.type)
		.with("text", () => (
			<MessageText
				side={side}
				message={zMessageText.parse(message.payload)}
			/>
		))
		.with("system", () => (
			<MessageText
				side={side}
				message={zMessageSystem.parse(message.payload)}
			/>
		))
		.with("gallery", () => <MessageGallery message={zMessageGallery.parse(message.payload)} />)
		.with("location", () => (
			<MessageLocation message={zMessageLocation.parse(message.payload)} />
		))
		.with("personal", () => (
			<MessagePersonal message={zMessagePersonal.parse(message.payload)} />
		))
		.with("package", () => <MessagePackage message={zMessagePackage.parse(message.payload)} />)
		.with("date", () => null)
		.exhaustive();
};
