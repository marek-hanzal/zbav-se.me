import {
	type ComponentProps,
	type FC,
	type ReactNode,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { uiContainerFn } from "~/ui/fn/uiContainerFn";
import { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Status } from "~/ui/ui/Status";

type ImageStatus = "loading" | "loaded" | "error";

type ImageState = {
	src: string | undefined;
	status: ImageStatus;
};

/**
 * Shared hero-image primitives.
 */
export namespace HeroImage {
	/**
	 * Props for {@link HeroImage}.
	 *
	 * Extends native `<img>` props plus UI-system container props (`ui`, `className`)
	 * so the image can be styled consistently across app surfaces.
	 */
	export interface Props extends uiContainerFn.Component<ComponentProps<"img">> {
		/**
		 * Controls whether the component should render at all.
		 *
		 * When `false`, the component returns `invisible` instead of rendering the image/loading/error states.
		 * Default: `true`.
		 */
		visible?: boolean;

		/**
		 * Optional overrides for the built-in error status.
		 *
		 * Used when image loading fails (`onError`) or when the image is complete but invalid.
		 */
		errorStatusProps?: Status.Props;
		spinner?: ReactNode;

		/**
		 * Fallback node rendered when `visible` is `false`.
		 */
		invisible?: ReactNode;
		wrapperProps?: Container.Props;
	}
}

/**
 * Progressive hero image with built-in loading/error UX.
 *
 * What this component is for:
 * - rendering high-priority "main" gallery/detail images
 * - centralizing loading and failure behavior so pages stay consistent
 *
 * Features:
 * - local load-state management (`loading` -> `loaded` -> `error`)
 * - auto-reset to loading when `src` changes
 * - immediate complete-image check on mount/layout pass
 * - fade-in transition when image becomes loaded
 * - spinner overlay while loading
 * - status fallback when image fails
 * - visibility gate (`visible`) with custom hidden fallback (`invisible`)
 * - passes through native `<img>` handlers/attributes while still controlling core behavior
 */
export const HeroImage: FC<HeroImage.Props> = ({
	visible = true,
	errorStatusProps,
	spinner,
	invisible,
	wrapperProps,
	onLoad: onLoadFn,
	onError: onErrorFn,
	//
	className,
	//
	...props
}) => {
	const translator = useTranslator();
	const [state, setStateFn] = useState<ImageState>({
		src: props.src,
		status: "loading",
	});
	const imgRef = useRef<HTMLImageElement | null>(null);
	const status = state.src === props.src ? state.status : "loading";

	useLayoutEffect(() => {
		const img = imgRef.current;
		if (!img) {
			return;
		}

		if (img.complete) {
			setStateFn({
				src: props.src,
				status: img.naturalWidth > 0 ? "loaded" : "error",
			});
		}
	}, [
		props.src,
	]);

	if (!visible) {
		return invisible;
	}

	return (
		<Container
			data-ui={"HeroImage"}
			data-ui-height={"full"}
			data-ui-width={"full"}
			data-ui-position={"relative"}
			className={[
				"overflow-hidden",
				className,
			]}
			{...wrapperProps}
		>
			{/** biome-ignore lint/a11y/useAltText: Should go from props */}
			<img
				ref={imgRef}
				key={props.src ?? "no-src"}
				className={
					"absolute inset-0 h-full w-full object-cover object-center transition-all"
				}
				//
				loading={"eager"}
				fetchPriority={"high"}
				decoding={"async"}
				referrerPolicy={"origin"}
				crossOrigin={"anonymous"}
				onLoad={(e) => {
					setStateFn({
						src: props.src,
						status: "loaded",
					});
					onLoadFn?.(e);
				}}
				onError={(e) => {
					console.error(e);
					setStateFn({
						src: props.src,
						status: "error",
					});
					onErrorFn?.(e);
				}}
				style={{
					opacity: status === "loaded" ? 1 : 0,
					transition: "opacity 120ms ease",
				}}
				{...props}
			/>

			{status === "loading" ? (
				<Container
					data-ui-height="full"
					data-ui-width="full"
					data-ui-position="absolute"
					data-ui-layout="vertical-centered"
					className={"inset-0"}
					data-ui={"HeroImage-[LoadingOverlay]"}
				>
					{spinner ?? <SpinnerContainer />}
				</Container>
			) : null}

			{status === "error" ? (
				<Container
					data-ui-layout="vertical-centered"
					data-ui-tone="primary"
					data-ui-theme="light"
					data-ui-height="full"
					data-ui-width="full"
					data-ui-position="absolute"
					className={"inset-0"}
					data-ui={"HeroImage-[ErrorOverlay]"}
				>
					<Status
						icon={"icon-[ph--image-broken-duotone]"}
						textTitle={translator.textFn("Image not available anymore")}
						{...errorStatusProps}
					/>
				</Container>
			) : null}
		</Container>
	);
};
