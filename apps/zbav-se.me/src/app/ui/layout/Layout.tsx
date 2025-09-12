import { type Cls, useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { LayoutCls } from "~/app/ui/layout/LayoutCls";

export namespace Layout {
	export interface Props extends LayoutCls.Props<PropsWithChildren> {
		layout?: Cls.VariantOf<LayoutCls, "layout">;
	}
}

export const Layout: FC<Layout.Props> = ({
	layout,
	cls = LayoutCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			layout,
		}),
	}));

	return <div className={slots.root()}>{children}</div>;
};
