import { tvc, useCls } from "@use-pico/cls";
import type { FC } from "react";
import { BackgroundCls } from "~/app/ui/background/BackgroundCls";

export namespace Background {
	export type Props = BackgroundCls.Props;
}

export const Background: FC<Background.Props> = ({
	cls = BackgroundCls,
	tweak,
}) => {
	const { slots } = useCls(cls, tweak);

	return (
		<div className={tvc(slots.root())}>
			<div className={tvc(slots.top())} />
			<div className={tvc(slots.bottom())} />
		</div>
	);
};
