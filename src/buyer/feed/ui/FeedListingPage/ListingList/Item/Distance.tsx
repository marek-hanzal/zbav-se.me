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
				ui={{
					...ui,
				}}
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
			ui={{
				text: "sm",
				font: "light",
				...ui,
			}}
			{...props}
		/>
	);
};
