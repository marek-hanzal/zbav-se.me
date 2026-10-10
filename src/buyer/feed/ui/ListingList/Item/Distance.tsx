import type { FC } from "react";
import { Container } from "@/lib/client/container";
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
				data-ui-text="default"
				data-ui-font="normal"
				{...props}
			/>
		);
	}

	return (
		<Container
			data-ui-flow={"horizontal"}
			data-ui-gap={"xs"}
			data-ui-items={"center"}
		>
			<Typo
				label={toLocaleNumber({
					locale,
					number: distance,
					maximumFractionDigits: 0,
				})}
				data-ui-text="default"
				data-ui-font="normal"
				{...props}
			/>

			<Typo
				label={"km"}
				data-ui-text="xs"
				data-ui-font="light"
			/>
		</Container>
	);
};
