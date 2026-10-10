import type { FC } from "react";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumber } from "~/number/fn/toLocaleNumber";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace RangeValue {
	export interface Props extends LabelValue.PropsEx {
		range: number | undefined;
	}
}

/**
 * Renders a read-only range value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 */
export const RangeValue: FC<RangeValue.Props> = ({ range, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<LabelValue
			data-ui={"RangeValue"}
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
