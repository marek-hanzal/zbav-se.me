import { LabelValue } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import type { ListingRestrictionEnumSchema } from "~/common/listing/enum/ListingRestrictionEnumSchema";

export namespace RestrictionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		restriction: ListingRestrictionEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only restriction value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const RestrictionValue: FC<RestrictionValue.Props> = ({ restriction, ...props }) => {
	return (
		<LabelValue
			data-ui={"RestrictionValue"}
			textLabel={translator.text("Listing restriction (label)")}
			textValue={restriction ? <Tx label={`Listing restriction - ${restriction}`} /> : null}
			textEmpty={translator.text("Restriction not selected")}
			textHint={translator.text("Listing restriction (hint)")}
			{...props}
		/>
	);
};
