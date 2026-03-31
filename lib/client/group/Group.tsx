import type { FC } from "react";
import { Container } from "../container/Container";

export namespace Group {
	export interface Props extends Container.Props {
		//
	}
}

export const Group: FC<Group.Props> = ({ children, ui, className, ...props }) => {
	return (
		<Container
			data-ui="Group[Container]"
			ui={{
				shadow: true,
				round: "default",
				width: "full",
				...ui,
			}}
			className={[
				/**
				 * Keep class name "Group" here - it's used by styles
				 */
				"Group",
				"min-h-fit",
				"shrink-0",
				className,
			]}
			{...props}
		>
			{children}
		</Container>
	);
};
