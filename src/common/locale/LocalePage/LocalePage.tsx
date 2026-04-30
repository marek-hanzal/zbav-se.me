import type { FC, PropsWithChildren } from "react";
import { LocaleContext } from "@/lib/client/locale";
import type { TranslationListSchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translation";

export namespace LocalePage {
	export interface Props extends PropsWithChildren {
		locale: string;
		translations: TranslationListSchema.Type;
	}
}

/**
 * Composes the route-level locale screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the locale journey.
 *
 * @see src/@routes
 */
export const LocalePage: FC<LocalePage.Props> = ({ locale, translations, children }) => {
	/**
	 * Ugly as hell, but for now I don't have better solution how to do this
	 * both on server and client side.
	 *
	 * The core idea is this route won't re-render, to it's quite safe to use it
	 * this way (out of effect and so on).
	 */
	translator.push(translations);

	return (
		<LocaleContext
			value={{
				locale,
			}}
		>
			{children}
		</LocaleContext>
	);
};
