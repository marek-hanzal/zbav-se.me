import { type FC, type ReactNode } from "react";
import { useVisible } from "../../hook/useVisible";
import { Container } from "./Container";

export namespace VisibleContainer {
	export namespace Placeholder {
		export type Render = () => ReactNode;
	}

	/**
	 * Props for a container that renders its children only after an element
	 * becomes visible within the viewport.
	 */
	export interface Props extends Container.Props {
		id: string;
		placeholder: Placeholder.Render;
	}
}

export const VisibleContainer: FC<VisibleContainer.Props> = ({
	id,
	placeholder,
	children,
	...props
}) => {
	const { byIdRef } = useVisible();

	return (
		<Container
			data-visible-item={id}
			{...props}
		>
			{byIdRef.current.get(id)?.visible ? children : placeholder()}
		</Container>
	);
};
