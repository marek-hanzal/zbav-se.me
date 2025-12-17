import { Container } from "@use-pico/client/ui/container";
import type { tMessageGallery } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace MessageGallery {
	export interface Props extends Container.Props {
		message: tMessageGallery;
	}
}

export const MessageGallery: FC<MessageGallery.Props> = ({ message, ...props }) => {
	return <Container {...props}>blabla</Container>;
};
