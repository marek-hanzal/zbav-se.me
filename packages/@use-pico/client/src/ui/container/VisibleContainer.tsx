import { type FC, type ReactNode, type RefObject, useRef, useState } from "react";
import { useElementVisibility } from "../../hook";
import { Container } from "./Container";

export namespace VisibleContainer {
	export namespace Placeholder {
		export interface Props {
			ref: RefObject<HTMLDivElement | null>;
		}

		export type Render = (props: Props) => ReactNode;
	}

	/**
	 * Props for a container that renders its children only after an element
	 * becomes visible within the viewport.
	 */
	export interface Props extends Container.Props {
		/**
		 * Visibility configuration passed to `useElementVisibility`, except for the
		 * `setVisible` callback which this component manages internally.
		 */
		visibility: Omit<useElementVisibility.Props, "setVisible" | "triggerRef">;
		/**
		 * React node displayed while the container itself remains hidden.
		 */
		placeholder: Placeholder.Render;
		/**
		 * Optional delay in milliseconds before the visibility state update is
		 * applied; defaults to `200ms`.
		 */
		delay?: number;
	}
}

/**
 * Renders a `Container` only after the observed element becomes visible in the
 * viewport, replacing the placeholder once the criteria are met.
 */
export const VisibleContainer: FC<VisibleContainer.Props> = ({
	visibility,
	delay = 200,
	placeholder,
	...props
}) => {
	const [visible, setVisible] = useState(false);
	const visibleRef = useRef(false);
	const timerRef = useRef<NodeJS.Timeout>(undefined);
	const triggerRef = useRef<HTMLDivElement>(null);

	useElementVisibility({
		...visibility,
		triggerRef,
		setVisible(visible) {
			visibleRef.current = visible;

			clearTimeout(timerRef.current);

			timerRef.current = setTimeout(() => {
				setVisible(visibleRef.current);
				timerRef.current = undefined;
			}, delay);
		},
	});

	if (!visible) {
		return placeholder({
			ref: triggerRef,
		});
	}

	return (
		<Container
			ref={triggerRef}
			{...props}
		/>
	);
};
