import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { useSnapper } from "~/app/ui/snapper/useSnapper";
import { SnapperItemCls } from "./SnapperItemCls";

export namespace SnapperItem {
	export interface Props extends SnapperItemCls.Props<PropsWithChildren> {
		disabled?: boolean;
	}
}

export const SnapperItem: FC<SnapperItem.Props> = ({
	disabled,
	cls = SnapperItemCls,
	tweak,
	children,
}) => {
	const { orientation } = useSnapper();
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			orientation,
			disabled,
		}),
	}));

	return <div className={slots.root()}>{children}</div>;
};
