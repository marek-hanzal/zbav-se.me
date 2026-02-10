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
				...ui,
			}}
			className={[
				"Group",
				className,
			]}
			{...props}
		>
			{children}
		</Container>
	);
};
