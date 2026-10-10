import type { FC } from "react";
import type { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace ExpiresValue {
	export interface Props extends LabelValue.PropsEx {
		expires: ListingExpireEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only expire at value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed
 */
export const ExpiresValue: FC<ExpiresValue.Props> = ({ expires, ...props }) => {
	const translator = useTranslator();
	const hasExpires = expires != null;
	return (
		<LabelValue
			data-ui={"ExpireAtValue"}
			textLabel={translator.textFn("Expire (title)")}
			textValue={hasExpires ? translator.textFn(`Expire in ${expires}`) : null}
			textEmpty={translator.textFn("Expiration date not set")}
			textHint={translator.textFn("Draft expire (hint)")}
			wrapperProps={{
				"data-ui-tone": hasExpires ? "neutral" : "primary",
			}}
			{...props}
		/>
	);
};
