import { useTranslator as useCoolTranslator } from "@/lib/client/translation";
import { withTranslationsQuery } from "../query/withTranslationsQuery";

export namespace useTranslator {
	export interface Props extends Omit<useCoolTranslator.Props, "query"> {
		//
	}
}

export const useTranslator = (props: useTranslator.Props) => {
	return useCoolTranslator({
		...props,
		query: withTranslationsQuery,
	});
};
