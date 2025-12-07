import { Container } from "@use-pico/client/ui/container";
import type { FC, ReactNode } from "react";

export namespace FlowContainer {
	export interface Props extends Container.Props {
		/**
		 * Optional node rendered in a sticky positioned wrapper on the left edge, e.g. flow-level actions.
		 */
		left?: ReactNode;
	}
}

/**
 * Flow container should wrap fullscreen flow content while keeping global sticky actions accessible.
 *
 * @param props Props extending `Container.Props`, supporting an optional `left` node for sticky actions.
 */
export const FlowContainer: FC<FlowContainer.Props> = ({ left, children, ...props }) => {
	return (
		<Container
			data-ui={"FlowContainer"}
			position={"relative"}
			height={"full"}
			width={"full"}
			{...props}
		>
			{left ? <div data-ui={"FlowContainer-left"}>{left}</div> : null}

			{children}
		</Container>
	);
};
