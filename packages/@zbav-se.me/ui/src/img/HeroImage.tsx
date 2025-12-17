import { Container, SpinnerContainer, uiContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import {
	type ComponentProps,
	type FC,
	type ReactNode,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";

export namespace HeroImage {
	export interface Props extends uiContainer.Component<ComponentProps<"img">> {
		visible?: boolean;
		errorStatusProps?: Status.Props;
		invisible?: ReactNode;
	}
}

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
						textTitle={"Image not available anymore"}
						{...errorStatusProps}
					/>
				</Container>
			) : null}
		</>
	);
};
