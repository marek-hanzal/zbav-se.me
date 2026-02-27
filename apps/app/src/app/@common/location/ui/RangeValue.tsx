import { useLocale } from "@use-pico/client/hook";
import { LabelValue } from "@use-pico/client/ui/container";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace RangeValue {
	export interface Props extends LabelValue.PropsEx {
		range: number | undefined;
	}
}

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
				ui:
					range !== undefined
						? {
								tone: "neutral",
								theme: "light",
							}
						: undefined,
			}}
			{...props}
		/>
	);
};
