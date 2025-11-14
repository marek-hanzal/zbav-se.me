import {
	type FC,
	type ReactNode,
	type RefObject,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
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
		visibility?: Omit<useElementVisibility.Visibility, "setVisible">;
		/**
		 * React node displayed while the container itself remains hidden.
		 */
		placeholder: Placeholder.Render;
		/**
		 * If true, content container will render earlier (in the proximity of the scrollable viewport).
		 */
		useProximity?: boolean;
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
	scrollerRef,
	visibility,
	useProximity = false,
	delay = 200,
	placeholder,
	...props
}) => {
	const triggerRef = useRef<HTMLDivElement>(null);
	//
	const [visible, setVisible] = useState(false);
	const visibleRef = useRef(false);
	const visibleTimerRef = useRef<NodeJS.Timeout>(undefined);
	//
	const [topProximity, setTopProximity] = useState(false);
	const topProximityRef = useRef(false);
	const topProximityTimerRef = useRef<NodeJS.Timeout>(undefined);
	//
	const [bottomProximity, setBottomProximity] = useState(false);
	const bottomProximityRef = useRef(false);
	const bottomProximityTimerRef = useRef<NodeJS.Timeout>(undefined);

	const isVisible = visible || topProximity || bottomProximity;

	const setState = useCallback(
		(
			state: boolean,
			timerRef: RefObject<NodeJS.Timeout | undefined>,
			ref: RefObject<boolean>,
			set: (value: boolean) => void,
		) => {
			ref.current = state;

			clearTimeout(timerRef.current);

			timerRef.current = setTimeout(() => {
				set(state);
				timerRef.current = undefined;
			}, delay);
		},
		[
			delay,
		],
	);

	useEffect(() => {
		return () => {
			clearTimeout(visibleTimerRef.current);
			clearTimeout(topProximityTimerRef.current);
			clearTimeout(bottomProximityTimerRef.current);
		};
	}, []);

	useElementVisibility({
		scrollerRef,
		triggerRef,
		visibility: {
			setVisible(state) {
				setState(state, visibleTimerRef, visibleRef, setVisible);
			},
			...visibility,
		},
		proximity: useProximity
			? {
					setTop: (state) => {
						setState(state, topProximityTimerRef, topProximityRef, setTopProximity);
					},
					setBottom: (state) => {
						setState(
							state,
							bottomProximityTimerRef,
							bottomProximityRef,
							setBottomProximity,
						);
					},
				}
			: undefined,
	});

	if (!isVisible) {
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
