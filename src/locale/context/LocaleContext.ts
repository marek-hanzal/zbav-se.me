import { createContext } from "react";

export namespace LocaleContext {
	export interface Context {
		locale: string;
	}
}

export const LocaleContext = createContext<LocaleContext.Context>({
	locale: "en",
});
