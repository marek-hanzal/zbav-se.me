import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import type { UiProps } from "node_modules/@use-pico/client/src/type/UiProps";
import {
	type FC,
	type ImgHTMLAttributes,
	type ReactNode,
	useState,
} from "react";
import { match } from "ts-pattern";

export namespace HeroImage {
	export interface Props
		extends UiProps<ImgHTMLAttributes<HTMLImageElement>> {
		visible?: boolean;
		errorStatusProps?: Status.Props;
		invisible?: ReactNode;
	}
}

export const HeroImage: FC<HeroImage.Props> = ({
	ui,
	visible = true,
	errorStatusProps,
	invisible,
	onLoad,
	onError,
	...props
}) => {
	const [state, setState] = useState<"loading" | "loaded" | "error">(
		"loading",
	);

	if (!visible) {
		return invisible;
	}

	return (
		<>
			{/** biome-ignore lint/a11y/useAltText: Should go from props */}
			<img
				data-ui={ui ?? "HeroImage-root"}
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
