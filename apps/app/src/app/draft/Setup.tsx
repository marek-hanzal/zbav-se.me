import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";

export namespace Setup {
	export interface Props extends Container.Props {
		draft: tDraft;
	}
}

export const Setup: FC<Setup.Props> = ({ draft, ...props }) => {
	return (
		<Container {...props}>
			<div>Setup</div>
		</Container>
	);
};
