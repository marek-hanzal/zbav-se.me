import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { LayoutCls } from "~/app/ui/layout/LayoutCls";

export namespace Layout {
	export interface Props extends LayoutCls.Props<PropsWithChildren> {}
}

export const Layout: FC<Layout.Props> = ({
	cls = LayoutCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);

	return <div className={slots.root()}>{children}</div>;
};
