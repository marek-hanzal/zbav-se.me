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
					ui={{
						snapTo: "top-left",
						zIndex: true,
					}}
					className={"z-200"}
				>
					{left}
				</Container>
			) : null}

			{right ? (
				<Container
					ui={{
						snapTo: "top-right",
						zIndex: true,
					}}
					className={"z-200"}
				>
					{right}
				</Container>
			) : null}

			{children}
		</Container>
	);
};
