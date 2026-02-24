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
import { MessageGallery } from "./type/MessageGallery";
import { MessageLocation } from "./type/MessageLocation";
import { MessagePackage } from "./type/MessagePackage";
import { MessagePersonal } from "./type/MessagePersonal";
import { MessageText } from "./type/MessageText";

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
