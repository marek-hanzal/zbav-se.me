import { createContext } from "react";
import { createToastStore } from "./createToastStore";

export const ToastContext = createContext<createToastStore.Hook>(
	createToastStore({
		maxCount: 5,
		delayMs: 2500,
	}),
);
