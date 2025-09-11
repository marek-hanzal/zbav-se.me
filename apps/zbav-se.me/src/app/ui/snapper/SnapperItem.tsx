import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { useSnapper } from "~/app/ui/snapper/useSnapper";
import { SnapperItemCls } from "./SnapperItemCls";

export namespace SnapperItem {
	export interface Props extends SnapperItemCls.Props<PropsWithChildren> {}
}

export const SnapperItem: FC<SnapperItem.Props> = ({
	cls = SnapperItemCls,
	tweak,
	children,
}) => {
	const { orientation } = useSnapper();
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			orientation,
		}),
	}));

	return <div className={slots.root()}>{children}</div>;
};
