import { asContainer } from "@use-pico/theme/container";
import type { ComponentProps, FC } from "react";

export namespace Container {
	export interface Props extends asContainer.Props<ComponentProps<"div">> {
		//
	}
}

export const Container: FC<Container.Props> = (props) => {
    return <div {...asContainer(props)} />;
};
