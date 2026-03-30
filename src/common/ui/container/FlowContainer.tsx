import type { FC, ReactNode } from "react";
import { Container } from "@/lib/client/container";

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
export const FlowContainer: FC<FlowContainer.Props> = ({ left, children, ui, ...props }) => {
	return (
		<Container
			data-ui={"FlowContainer[Container]"}
			ui={{
				position: "relative",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			{left ? (
				<Container
					data-ui={"FlowContainer-[Container.left]"}
					ui={{
						snapTo: "top-left",
						zIndex: true,
					}}
				>
					{left}
				</Container>
			) : null}

			{children}
		</Container>
	);
};
