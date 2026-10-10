import type { FC } from "react";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumber } from "~/number/fn/toLocaleNumber";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { Typo } from "~/ui/ui/Typo";

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
