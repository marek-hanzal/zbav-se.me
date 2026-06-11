import type { FC } from "react";
import type { Button } from "@/lib/client/button";
import type { PackageSchema } from "~/user/stripe/server/schema/PackageSchema";
import { ShopCheckoutButton } from "./ShopCheckoutButton";

export namespace PackageCheckoutButton {
	export interface Props extends Button.Props {
		bundle: PackageSchema.Type;
	}
}

export const PackageCheckoutButton: FC<PackageCheckoutButton.Props> = ({ bundle, ...props }) => {
	return (
		<ShopCheckoutButton
			{...props}
			bundle={bundle.bundle}
			currency={bundle.currency}
			dataUi="PackageCheckoutButton"
			label="Start subscription (button)"
			price={bundle.price}
			withMonthlySuffix
		/>
	);
};
