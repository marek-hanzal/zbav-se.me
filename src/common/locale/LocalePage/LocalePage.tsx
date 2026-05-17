import type { FC, PropsWithChildren } from "react";
import { LocaleContext } from "@/lib/client/locale";
import { TranslationContext } from "@/lib/client/translation";
import type { TranslationSchema } from "@/lib/common/schema";

export namespace LocalePage {
	export interface Props extends PropsWithChildren {
		locale: string;
		translations: TranslationSchema.Type[];
	}
}

/**
 * Composes the route-level locale screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the locale journey.
 */
export const LocalePage: FC<LocalePage.Props> = ({ locale, translations, children }) => {
	return (
		<LocaleContext
			value={{
				locale,
			}}
		>
			<TranslationContext value={translations}>{children}</TranslationContext>
		</LocaleContext>
	);
};
