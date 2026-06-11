import type { FC } from "react";
import type { Button } from "@/lib/client/button";
import type { ExtraSchema } from "~/user/stripe/server/schema/ExtraSchema";
import { ShopCheckoutButton } from "./ShopCheckoutButton";

export namespace ExtraCheckoutButton {
	export interface Props extends Button.Props {
		bundle: ExtraSchema.Type;
	}
}

export const ExtraCheckoutButton: FC<ExtraCheckoutButton.Props> = ({ bundle, ...props }) => {
	return (
		<ShopCheckoutButton
			{...props}
			bundle={bundle.bundle}
			currency={bundle.currency}
			dataUi="ExtraCheckoutButton"
			label="Buy extra (button)"
			price={bundle.price}
		/>
	);
};
