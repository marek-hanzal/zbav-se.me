import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { SnapperCls } from "~/app/ui/snapper/SnapperCls";

export namespace Snapper {
	export interface Props extends SnapperCls.Props<PropsWithChildren> {}
}

export const Snapper: FC<Snapper.Props> = ({
	cls = SnapperCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);

	return <div className={slots.root()}>{children}</div>;
};
