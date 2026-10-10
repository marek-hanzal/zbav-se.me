import { type FC, type ReactNode, useMemo } from "react";
import { Container } from "~/ui/ui/Container";
import { useVisible } from "~/visibility/hook/useVisible";

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
		placeholderFn: Placeholder.Render;
	}
}

export const VisibleContainer: FC<VisibleContainer.Props> = ({
	id,
	placeholderFn,
	children,
	...props
}) => {
	const useStore = useVisible();
	const visible = useStore((state) => state.getByIdFn(id)?.isVisible ?? false);

	const node = useMemo(() => {
		return visible ? children : placeholderFn();
	}, [
		visible,
		children,
		placeholderFn,
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
