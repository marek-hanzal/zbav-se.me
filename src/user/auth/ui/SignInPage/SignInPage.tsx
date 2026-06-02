import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { Fade } from "@/lib/client/fade";
import { WithEmail } from "./WithEmail";
import { WithMagic } from "./WithMagic";

export namespace SignInPage {
	export interface Props extends Container.Props {
		target?: string;
	}
}

export const SignInPage: FC<SignInPage.Props> = ({ target, ...props }) => {
	const rootRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui="SignInPage"
			data-ui-position="relative"
			data-ui-height="full"
			{...props}
		>
			<Fade scrollableRef={rootRef} />

			<Container
				ref={rootRef}
				data-ui-layout="vertical-full"
				data-ui-gap="default"
				data-ui-snap="vertical"
				data-ui-snap-align="center"
				data-ui-height="full"
			>
				<WithEmail target={target} />

				<WithMagic target={target} />
			</Container>
		</Container>
	);
};
