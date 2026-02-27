import { Container, SpinnerContainer, uiContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import {
	type ComponentProps,
	type FC,
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

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
	export interface Props extends uiContainer.Component<ComponentProps<"img">> {
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

		/**
		 * Fallback node rendered when `visible` is `false`.
		 */
		invisible?: ReactNode;
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
	invisible,
	onLoad,
	onError,
	//
	ui,
	className,
	//
	...props
}) => {
	const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
	const imgRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		void props.src;
		setState("loading");
	}, [
		props.src,
	]);

	useLayoutEffect(() => {
		const img = imgRef.current;
		if (!img) {
			return;
		}

		if (img.complete) {
			setState(img.naturalWidth > 0 ? "loaded" : "error");
		}
	});

	if (!visible) {
		return invisible;
	}

	return (
		<>
			{/** biome-ignore lint/a11y/useAltText: Should go from props */}
			<img
				ref={imgRef}
				key={props.src ?? "no-src"}
				{...uiContainer({
					ui: {
						height: "full",
						width: "full",
						...ui,
					},
					className: [
						"object-cover",
						"object-center",
						className,
					],
				})}
				//
				loading={"eager"}
				fetchPriority={"high"}
				decoding={"async"}
				referrerPolicy={"origin"}
				crossOrigin={"anonymous"}
				onLoad={(e) => {
					setState("loaded");
					onLoad?.(e);
				}}
				onError={(e) => {
					console.error(e);
					setState("error");
					onError?.(e);
				}}
				style={{
					opacity: state === "loaded" ? 1 : 0,
					transition: "opacity 120ms ease",
				}}
				{...props}
			/>

			{state === "loading" ? <SpinnerContainer /> : null}

			{state === "error" ? (
				<Container
					data-ui={"HeroImage-error"}
					ui={{
						layout: "vertical-centered",
						tone: "primary",
						theme: "light",
					}}
				>
					<Status
						icon={"icon-[ph--image-broken-duotone]"}
						textTitle={translator.text("Image not available anymore")}
						{...errorStatusProps}
					/>
				</Container>
			) : null}
		</>
	);
};
