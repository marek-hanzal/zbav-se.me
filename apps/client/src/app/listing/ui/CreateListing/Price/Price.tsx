import { Badge, Icon, PriceInline, Typo, UnCheckIcon } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { PriceCls } from "~/app/listing/ui/CreateListing/Price/PriceCls";

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
				size={"lg"}
				tone="secondary"
				theme="light"
			/>

			<Icon
				icon={UnCheckIcon}
				tone="secondary"
				theme="light"
				size={"md"}
				onClick={onClear}
			/>
		</Badge>
	);
};
