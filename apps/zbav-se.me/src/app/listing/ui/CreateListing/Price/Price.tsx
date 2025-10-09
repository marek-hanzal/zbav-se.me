import { Icon, PriceInline, Typo, UnCheckIcon } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import type { FC } from "react";
import { PriceCls } from "~/app/listing/ui/CreateListing/Price/PriceCls";

export namespace Price {
	export interface Props extends PriceCls.Props {
		price: number;
		onClear(): void;
	}
}

export const Price: FC<Price.Props> = ({
	price,
	onClear,
	cls = PriceCls,
	tweak,
}) => {
	const { slots } = useCls(cls, tweak);

	return (
		<div className={slots.root()}>
			<Typo
				label={
					<PriceInline
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
				tone="primary"
				theme="dark"
			/>

			<Icon
				icon={UnCheckIcon}
				tone="primary"
				theme="dark"
				size={"md"}
				onClick={onClear}
			/>
		</div>
	);
};
