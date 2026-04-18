import type { FC, ReactNode } from "react";
import { Container } from "@/lib/client/container";

export namespace FlowContainer {
	export interface Props extends Container.Props {
		/**
		 * Optional node rendered in a sticky positioned wrapper on the left edge, e.g. flow-level actions.
		 */
		left?: ReactNode;
		right?: ReactNode;
	}
}

/**
 * Flow container should wrap fullscreen flow content while keeping global sticky actions accessible.
 *
 * @param props Props extending `Container.Props`, supporting an optional `left` node for sticky actions.
 */
export const FlowContainer: FC<FlowContainer.Props> = ({ left, right, children, ...props }) => {
	return (
		<Container
			data-ui={"FlowContainer[Container]"}
			data-ui-position="relative"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
		>
			{left ? (
				<Container
					data-ui-snap-to="top-left"
					data-ui-z-index
					className={"z-200"}
				>
					{left}
				</Container>
			) : null}

			{right ? (
				<Container
					data-ui-snap-to="top-right"
					data-ui-z-index
					className={"z-200"}
				>
					{right}
				</Container>
			) : null}

			{children}
		</Container>
	);
};
