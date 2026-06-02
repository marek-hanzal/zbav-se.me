import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { LabelValue } from "@/lib/client/value";
import { toLocaleNumber } from "@/lib/common/to-locale-number";

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
