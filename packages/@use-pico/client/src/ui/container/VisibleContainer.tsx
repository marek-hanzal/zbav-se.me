import { type FC, type ReactNode, useMemo } from "react";
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
		/**
		 * Should be stable function
		 */
		placeholder: Placeholder.Render;
	}
}

export const VisibleContainer: FC<VisibleContainer.Props> = ({
	id,
	placeholder,
	children,
	...props
}) => {
	const useStore = useVisible();
	const visible = useStore((state) => state.getById(id)?.isVisible ?? false);

	const node = useMemo(() => {
		return visible ? children : placeholder();
	}, [
		visible,
		children,
		placeholder,
	]);

	return (
		<Container
			data-ui={"VisibleContainer"}
			data-visible-item={id}
			{...props}
		>
			{node}
		</Container>
	);
};
