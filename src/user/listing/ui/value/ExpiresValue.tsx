import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";
import type { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";

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
			textLabel={translator.text("Expire (title)")}
			textValue={hasExpires ? translator.text(`Expire in ${expires}`) : null}
			textEmpty={translator.text("Expiration date not set")}
			textHint={translator.text("Draft expire (hint)")}
			{...props}
		/>
	);
};
