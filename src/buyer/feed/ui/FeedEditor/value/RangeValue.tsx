import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { LabelValue } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { translator } from "@/lib/common/translator";

export namespace RangeValue {
	export interface Props extends LabelValue.PropsEx {
		range: number | undefined;
	}
}

/**
 * Renders a read-only range value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const RangeValue: FC<RangeValue.Props> = ({ range, ...props }) => {
	const locale = useLocale();

	return (
		<LabelValue
			data-ui={"RangeValue[LabelValue]"}
			textLabel={translator.text("Feed range (label)")}
			textValue={
				range !== undefined
					? `${toLocaleNumber({
							locale,
							number: range,
							maximumFractionDigits: 1,
						})} km`
					: null
			}
			textEmpty={translator.text("Feed range not set")}
			textHint={translator.text("Feed range (hint)")}
			wrapperProps={{
				...(range !== undefined
					? {
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
						}
					: undefined),
			}}
			{...props}
		/>
	);
};
