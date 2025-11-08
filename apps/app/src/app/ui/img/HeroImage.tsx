import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import { type FC, type ImgHTMLAttributes, useState } from "react";
import { match } from "ts-pattern";

export namespace HeroImage {
	export interface Props extends ImgHTMLAttributes<HTMLImageElement> {
		visible?: boolean;
		errorStatusProps?: Status.Props;
	}
}

export const HeroImage: FC<HeroImage.Props> = ({
	visible = true,
	errorStatusProps,
	onLoad,
	onError,
	...props
}) => {
	const [state, setState] = useState<"loading" | "loaded" | "error">(
		"loading",
	);

	if (!visible) {
		return null;
	}

	return (
		<>
			{/** biome-ignore lint/a11y/useAltText: Should go from props */}
			<img
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
					layout={"vertical-centered"}
					tone={"primary"}
					theme={"light"}
					items={"center"}
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
