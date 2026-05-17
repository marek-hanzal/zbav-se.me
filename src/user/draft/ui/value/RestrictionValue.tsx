import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { LabelValue } from "@/lib/client/value";
import type { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";

export namespace RestrictionValue {
	export interface Props extends Omit<LabelValue.Props, "textValue"> {
		restriction: RestrictionEnumSchema.Type | null | undefined;
	}
}

/**
 * Renders a read-only restriction value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const RestrictionValue: FC<RestrictionValue.Props> = ({ restriction, ...props }) => {
	const translator = useTranslator();
	return (
		<LabelValue
			data-ui={"RestrictionValue"}
			textLabel={translator.text("Listing restriction (label)")}
			textValue={restriction ? <Tx label={`Listing restriction - ${restriction}`} /> : null}
			textEmpty={translator.text("Restriction not selected")}
			textHint={translator.text("Listing restriction (hint)")}
			wrapperProps={{
				"data-ui-tone": restriction !== null ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
