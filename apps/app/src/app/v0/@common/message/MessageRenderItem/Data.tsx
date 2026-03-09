import type { MarkSuspense } from "@use-pico/client/type";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import {
	zMessageGallery,
	zMessageLocation,
	zMessagePackage,
	zMessagePersonal,
	zMessageSystem,
	zMessageText,
} from "@zbav-se.me/sdk/api/user";
import { withMessageQuery } from "@zbav-se.me/sdk/query/user/message";
import type { FC } from "react";
import { match } from "ts-pattern";
import { MessageGallery } from "../type/MessageGallery";
import { MessageLocation } from "../type/MessageLocation";
import { MessagePackage } from "../type/MessagePackage";
import { MessagePersonal } from "../type/MessagePersonal";
import { MessageText } from "../type/MessageText";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		side: tUserSideEnum;
		messageId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, side, messageId }) => {
	const { data: message } = withMessageQuery.useFetchQuery(messageId);

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
