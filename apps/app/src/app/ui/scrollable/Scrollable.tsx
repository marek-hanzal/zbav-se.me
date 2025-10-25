import { Container } from "@use-pico/client";
import { type FC, useRef } from "react";
import { Fade } from "~/app/ui/fade/Fade";

export namespace Scrollable {
	export interface Props extends Container.Props {}
}

export const Scrollable: FC<Scrollable.Props> = (props) => {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<Container ref={ref}>
			<Fade scrollableRef={ref} />

			<Container
				layout={"vertical"}
				overflow={"vertical"}
				{...props}
			/>
		</Container>
	);
};
