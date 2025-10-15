import { Badge, Icon, PriceInline, Typo } from "@use-pico/client";
import type { FC } from "react";
import { ClearIcon } from "~/app/ui/icon/ClearIcon";

export namespace Price {
	export interface Props {
		locale: string;
		price: number;
		onClear(): void;
	}
}

export const Price: FC<Price.Props> = ({ locale, price, onClear }) => {
	return (
		<Badge
			tone="secondary"
			theme="light"
			size={"lg"}
			tweak={{
				slot: {
					root: {
						class: [
							"inline-flex",
							"flex-row",
							"items-center",
							"justify-between",
							"w-full",
						],
					},
				},
			}}
		>
			<Typo
				label={
					<PriceInline
						locale={locale}
						value={{
							price,
							withVat: undefined,
						}}
					/>
				}
				font={"bold"}
				size={"xl"}
				tone="secondary"
				theme="light"
			/>

			<Icon
				icon={ClearIcon}
				tone="secondary"
				theme="light"
				size={"sm"}
				onClick={onClear}
			/>
		</Badge>
	);
};
