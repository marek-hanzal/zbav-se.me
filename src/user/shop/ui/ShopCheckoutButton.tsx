import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { CartIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { PriceInline } from "@/lib/client/price-inline";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { uiSaveButton } from "~/common/ui/ui";
import { withCheckoutMutation } from "~/user/stripe/mutation/withCheckoutMutation";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export namespace ShopCheckoutButton {
	export interface Props extends Button.Props {
		bundle: ResourceBundleEnumSchema.Type;
		currency: string;
		dataUi: "ExtraCheckoutButton" | "PackageCheckoutButton";
		label: "Buy extra (button)" | "Start subscription (button)";
		price: number;
		withMonthlySuffix?: boolean;
	}
}

export const ShopCheckoutButton: FC<ShopCheckoutButton.Props> = ({
	bundle,
	className,
	currency,
	dataUi,
	label,
	price,
	withMonthlySuffix = false,
	...props
}) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const checkoutMutation = withCheckoutMutation.useMutation({
		async onPostMutation({ result }) {
			await navigate({
				href: result.url,
			});
		},
	});

	return (
		<Button
			{...uiSaveButton({})}
			{...props}
			data-ui={dataUi}
			data-action="checkout"
			data-resource-bundle={bundle}
			data-ui-bundle={bundle}
			data-ui-height="content"
			data-ui-inner="lg"
			data-ui-gap="default"
			iconEnabled={CartIcon}
			iconProps={{
				"data-ui-text": "xl",
			}}
			loading={checkoutMutation.isPending}
			disabled={checkoutMutation.isPending || props.disabled}
			className={className}
			onClick={() => {
				checkoutMutation.mutate({
					locale,
					bundle,
				});
			}}
		>
			<Tx label={label} />

			<Typo
				data-ui-font="bold"
				label={
					<PriceInline
						price={price / 100}
						locale={locale}
						currency={currency.toUpperCase()}
					/>
				}
			/>

			{withMonthlySuffix ? (
				<Tx
					label="Per month (label)"
					data-ui-text="sm"
				/>
			) : null}
		</Button>
	);
};
