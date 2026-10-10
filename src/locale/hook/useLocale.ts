import { useContext } from "react";
import { LocaleContext } from "~/locale/context/LocaleContext";

export const useLocale = () => {
	return useContext(LocaleContext).locale;
};
