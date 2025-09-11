import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { useRef } from "react";
import { SnapperCtx } from "~/app/ui/snapper/SnapperCtx";
import { SnapperCls } from "./SnapperCls";

export namespace Snapper {
	export interface Props extends SnapperCls.Props<PropsWithChildren> {
		orientation: "vertical" | "horizontal";
	}
}

export const Snapper: FC<Snapper.Props> = ({
	orientation,
	cls = SnapperCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);
	const containerRef = useRef<HTMLDivElement | null>(null);

	return (
		<SnapperCtx
			value={{
				containerRef,
				orientation,
			}}
		>
			<div className={slots.root()}>{children}</div>
		</SnapperCtx>
	);
};
