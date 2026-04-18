import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { toLocaleNumber } from "@/lib/common/to-locale-number";

export namespace Distance {
	export interface Props extends Omit<Typo.Props, "label"> {
		distance: number | null;
	}
}

export const Distance: FC<Distance.Props> = ({ distance, ...props }) => {
	const locale = useLocale();

	if (distance === null) {
		return null;
	}

	if (distance <= 1) {
		return (
			<Tx
				label={"Behind corner (label)"}
				{...props}
			/>
		);
	}

	return (
		<Typo
			label={`${toLocaleNumber({
				locale,
				number: distance,
				maximumFractionDigits: 1,
			})}km`}
			data-ui-text="sm"
			data-ui-font="light"
			{...props}
		/>
	);
};
