import type { FC } from "react";
import { Container } from "../container/Container";

export namespace Group {
	export interface Props extends Container.Props {
		//
	}
}

export const Group: FC<Group.Props> = ({ children, className, ...props }) => {
	return (
		<Container
			data-ui="Group[Container]"
			data-ui-shadow
			data-ui-round={"default"}
			data-ui-width={"full"}
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
