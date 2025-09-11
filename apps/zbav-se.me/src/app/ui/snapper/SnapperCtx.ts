import { createContext, type RefObject } from "react";

type Ctx = {
	viewportRef: RefObject<HTMLDivElement | null>;
	orientation: "vertical" | "horizontal";
};

export const SnapperCtx = createContext<Ctx | null>(null);
