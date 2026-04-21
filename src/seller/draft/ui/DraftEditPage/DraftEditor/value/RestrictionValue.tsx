import type { FC } from "react";
import { Tx } from "@/lib/client/tx";
import { LabelValue } from "@/lib/client/value";
import { translator } from "@/lib/common/translator";
import type { CategoryRestrictionEnumSchema } from "~/common/category/enum/CategoryRestrictionEnumSchema";

export namespace RestrictionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		restriction: CategoryRestrictionEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only restriction value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
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
