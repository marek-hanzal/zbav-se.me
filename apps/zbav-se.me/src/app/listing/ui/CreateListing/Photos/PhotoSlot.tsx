import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { PhotoSlotCls } from "./PhotoSlotCls";

export namespace PhotoSlot {
	export interface Props extends PhotoSlotCls.Props {
		slot: number;
	}
}

export const PhotoSlot: FC<PhotoSlot.Props> = ({
	cls = PhotoSlotCls,
	tweak,
	slot,
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			default: slot === 0,
		}),
	}));

	return (
		<div className={slots.root()}>
			<div className={slots.slot()}>placeholder</div>
		</div>
	);
};
