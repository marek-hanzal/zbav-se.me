import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { LabelValue } from "@/lib/client/value";

export namespace RangeValue {
	export interface Props extends LabelValue.PropsEx {
		range: number | undefined;
	}
}

/**
 * Renders a read-only range value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
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
