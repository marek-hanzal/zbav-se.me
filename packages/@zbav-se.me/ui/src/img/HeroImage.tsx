import type { Ui } from "@use-pico/client/ui/";
import { Container, SpinnerContainer, uiContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { type ComponentProps, type FC, type ReactNode, useState } from "react";
import { match } from "ts-pattern";

export namespace HeroImage {
	export interface Props extends uiContainer.Component<ComponentProps<"img">> {
		visible?: boolean;
		errorStatusProps?: Status.Props;
		invisible?: ReactNode;
		round?: Ui.Round;
	}
}

export const HeroImage: FC<HeroImage.Props> = ({
	visible = true,
	errorStatusProps,
	invisible,
	onLoad,
	onError,
	//
	round,
	ui,
	className,
	//
	...props
}) => {
	const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

	if (!visible) {
		return invisible;
	}

	return (
		<>
			{/** biome-ignore lint/a11y/useAltText: Should go from props */}
			<img
				{...uiContainer({
					ui: {
						round,
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
					setState("error");
					onError?.(e);
				}}
				style={{
					display: match(state)
						.with("error", "loading", () => "none")
						.with("loaded", () => "block")
						.exhaustive(),
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
