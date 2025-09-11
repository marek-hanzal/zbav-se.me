import { useCls } from "@use-pico/cls";
import type { FC, PropsWithChildren, RefObject } from "react";
import { createContext, useContext, useRef } from "react";
import { SnapperCls } from "./SnapperCls";

type Ctx = {
	viewportRef: RefObject<HTMLDivElement | null>;
};
const SnapperCtx = createContext<Ctx | null>(null);
export const useSnapper = () => {
	const c = useContext(SnapperCtx);
	if (!c) throw new Error("Snapper* must be inside <Snapper/>");
	return c;
};

export namespace Snapper {
	export interface Props extends SnapperCls.Props<PropsWithChildren> {
		orientation: "vertical" | "horizontal";
	}
}

export const Snapper: FC<Snapper.Props> = ({
	orientation,
	cls = SnapperCls,
	tweak,
	children,
}) => {
	const slots = useCls(cls, tweak);
	const viewportRef = useRef<HTMLDivElement | null>(null);

	return (
		<SnapperCtx.Provider
			value={{
				viewportRef,
			}}
		>
			<div className={slots.root()}>{children}</div>
		</SnapperCtx.Provider>
	);
};
