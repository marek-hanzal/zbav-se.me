import { createContext } from "react";
import { createTabsStore } from "./createTabsStore";

export const TabsContext = createContext<createTabsStore.UseStore>(
	createTabsStore({
		tab: undefined,
		hidden: [],
	}),
);
