import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { SnapperContentCls } from "./SnapperContentCls";
import { useSnapper } from "./useSnapper";

export namespace SnapperContent {
	export interface Props extends SnapperContentCls.Props<PropsWithChildren> {}
}

export const SnapperContent: FC<SnapperContent.Props> = ({
	cls = SnapperContentCls,
	tweak,
	children,
}) => {
	const { viewportRef, orientation } = useSnapper();
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			orientation,
		}),
	}));

	return (
		<div
			ref={viewportRef}
			className={slots.viewport()}
		>
			<div className={slots.content()}>{children}</div>
		</div>
	);
};
