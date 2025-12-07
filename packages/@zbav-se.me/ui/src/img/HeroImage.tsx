import type { UiProps } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { type Cls, useCls } from "@use-pico/cls";
import { type FC, type ImgHTMLAttributes, type ReactNode, useState } from "react";
import { match } from "ts-pattern";
import { HeroImageCls } from "./HeroImageCls";

export namespace HeroImage {
	export interface Props
		extends HeroImageCls.Props<UiProps<ImgHTMLAttributes<HTMLImageElement>>> {
		visible?: boolean;
		errorStatusProps?: Status.Props;
		invisible?: ReactNode;
		round?: Cls.VariantOf<HeroImageCls, "round">;
	}
}

export const HeroImage: FC<HeroImage.Props> = ({
	ui,
	visible = true,
	errorStatusProps,
	invisible,
	onLoad,
	onError,
	round,
	cls = HeroImageCls,
	tweak,
	...props
}) => {
	const { slots } = useCls(cls, tweak, {
		variant: {
			round,
		},
	});
	const [state, setState] = useState<"loading" | "loaded" | "error">("loading");

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
				className={slots.img()}
				{...props}
			/>

			{state === "loading" ? <SpinnerContainer /> : null}

			{state === "error" ? (
				<Container
					data-ui={"HeroImage-error"}
					layout={"vertical-centered"}
					tone={"primary"}
					theme={"light"}
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
