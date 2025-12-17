import { Container } from "@use-pico/client/ui/container";
import type { tMessageLocation } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { LocationValue } from "~/app/location/ui/LocationValue";

export namespace MessageLocation {
	export interface Props extends Container.Props {
		message: tMessageLocation;
	}
}

export const MessageLocation: FC<MessageLocation.Props> = ({ message, ...props }) => {
	return (
		<Container {...props}>
			<LocationValue locationId={message.locationId} />
		</Container>
	);
};
