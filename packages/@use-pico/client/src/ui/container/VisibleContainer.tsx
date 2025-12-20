import { type FC, type ReactNode, type RefObject, useRef } from "react";
import { VisibilityProvider } from "../../context/VisibilityProvider";
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
		scrollerRef: RefObject<HTMLElement | null>;
		/**
		 * Visibility configuration passed to `useElementVisibility`, except for the
		 * `setVisible` callback which this component manages internally.
		 */
		visibility?: useElementVisibility.Visibility;
		/**
		 * React node displayed while the container itself remains hidden.
		 */
		placeholder: Placeholder.Render;
		/**
		 * If true, content container will render earlier (in the proximity of the scrollable viewport).
		 */
		proximity?: useElementVisibility.Proximity;
		/**
		 * Optional delay in milliseconds before the visibility state update is
		 * applied; defaults to `200ms`.
		 */
		delayMs?: number;
	}
}

/**
 * Renders a `Container` only after the observed element becomes visible in the
 * viewport, replacing the placeholder once the criteria are met.
 */
export const VisibleContainer: FC<VisibleContainer.Props> = ({
	scrollerRef,
	visibility,
	proximity,
	delayMs = 200,
	placeholder,
	...props
}) => {
	const triggerRef = useRef<HTMLDivElement>(null);

	const state = useElementVisibility({
		scrollerRef,
		triggerRef,
		delayMs,
		visibility,
		proximity,
	});

	if (!state.isVisible) {
		return (
			<Container
				ref={triggerRef}
				{...props}
			>
				{placeholder({
					ref: triggerRef,
				})}
			</Container>
		);
	}

	/**
	 * We're re-creating visible store every time, but in this case we don't care as the
	 * source of truth are states in this component
	 */
	return (
		<VisibilityProvider state={state}>
			<Container
				ref={triggerRef}
				{...props}
			/>
		</VisibilityProvider>
	);
};
