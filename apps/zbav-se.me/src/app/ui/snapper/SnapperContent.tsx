import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { useSnapper } from "./Snapper";
import { SnapperContentCls } from "./SnapperContentCls";

export namespace SnapperContent {
	export interface Props extends SnapperContentCls.Props<PropsWithChildren> {}
}

export const SnapperContent: FC<SnapperContent.Props> = ({
	cls = SnapperContentCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);
	const { viewportRef } = useSnapper();

	return (
		<div
			ref={viewportRef}
			className={slots.viewport()}
		>
			<div className={slots.content()}>{children}</div>
		</div>
	);
};
