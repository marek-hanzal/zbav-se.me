import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren } from "react";
import { ContentCls } from "~/app/ui/content/ContentCls";

export namespace Content {
	export interface Props extends ContentCls.Props<PropsWithChildren> {}
}

export const Content: FC<Content.Props> = ({
	children,
	cls = ContentCls,
	tweak,
}) => {
	const slots = useCls(cls, tweak);
	return (
		<div className={slots.root()}>
			<div className={slots.inner()}>{children}</div>
		</div>
	);
};
