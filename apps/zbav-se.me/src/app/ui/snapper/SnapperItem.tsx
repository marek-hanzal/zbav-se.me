import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { SnapperItemCls } from "~/app/ui/snapper/SnapperItemCls";

export namespace SnapperItem {
	export interface Props extends SnapperItemCls.Props<PropsWithChildren> {}
}

export const SnapperItem: FC<SnapperItem.Props> = ({
	cls = SnapperItemCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);

	return (
		<div
			className={slots.root()}
			data-snapper-page=""
		>
			{children}
		</div>
	);
};
