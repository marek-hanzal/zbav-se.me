import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace PriceMinValue {
	export interface Props extends LabelValue.PropsEx {
		value: number | null | undefined;
	}
}

export const PriceMinValue: React.FC<PriceMinValue.Props> = ({ value, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();
	const hasValue = value != null;

	return (
		<LabelValue
			textLabel={translator.textFn("Minimum price (label)")}
			textValue={
				hasValue
					? toLocaleNumberFn({
							locale,
							number: value,
						})
					: null
			}
			textEmpty={translator.textFn("Minimum price not set")}
			wrapperProps={{
				"data-ui-tone": hasValue ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
