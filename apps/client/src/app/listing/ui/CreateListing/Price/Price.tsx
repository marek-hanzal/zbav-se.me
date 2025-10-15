import { Badge, Icon, PriceInline, Typo } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { PriceCls } from "~/app/listing/ui/CreateListing/Price/PriceCls";
import { ClearIcon } from "~/app/ui/icon/ClearIcon";

export namespace Price {
	export interface Props extends PriceCls.Props {
		locale: string;
		price: number;
		onClear(): void;
	}
}

export const Price: FC<Price.Props> = ({
	locale,
	price,
	onClear,
	cls = PriceCls,
	tweak,
}) => {
	const { slots } = useCls(cls, tweak);

	return (
		<Badge
			tone="secondary"
			theme="light"
			size={"lg"}
		>
			<Typo
				label={
					<PriceInline
						locale={locale}
						value={{
							price,
							withVat: undefined,
						}}
						minimumFractionDigits={2}
						maximumFractionDigits={2}
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
