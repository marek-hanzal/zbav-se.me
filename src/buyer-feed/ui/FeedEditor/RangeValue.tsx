import type { FC } from "react";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
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
			textLabel={translator.textFn("Feed range (label)")}
			textValue={
				range !== undefined
					? `${toLocaleNumberFn({
							locale,
							number: range,
							maximumFractionDigits: 1,
						})} km`
					: null
			}
			textEmpty={translator.textFn("Feed range not set")}
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
