import { useContext } from "react";
import { LocaleContext } from "../context/LocaleContext";

export const useLocale = () => {
	return useContext(LocaleContext).locale;
};
