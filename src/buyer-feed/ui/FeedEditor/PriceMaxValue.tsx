import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumber } from "~/number/fn/toLocaleNumber";
import { useTranslator } from "~/translation/hook/useTranslator";
import { LabelValue } from "~/ui/ui/LabelValue";

export namespace PriceMaxValue {
	export interface Props extends LabelValue.PropsEx {
		value: number | null | undefined;
	}
}

export const PriceMaxValue: React.FC<PriceMaxValue.Props> = ({ value, ...props }) => {
	const translator = useTranslator();
	const locale = useLocale();
	const hasValue = value != null;

	return (
		<LabelValue
			textLabel={translator.text("Maximum price (label)")}
			textValue={
				hasValue
					? toLocaleNumber({
							locale,
							number: value,
						})
					: null
			}
			textEmpty={translator.text("Maximum price not set")}
			wrapperProps={{
				"data-ui-tone": hasValue ? "neutral" : "secondary",
			}}
			{...props}
		/>
	);
};
