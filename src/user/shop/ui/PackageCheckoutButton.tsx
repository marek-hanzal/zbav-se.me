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
import type { PackageSchema } from "~/user/stripe/server/schema/PackageSchema";

export namespace PackageCheckoutButton {
	export interface Props extends Button.Props {
		bundle: PackageSchema.Type;
	}
}

export const PackageCheckoutButton: FC<PackageCheckoutButton.Props> = ({
	bundle,
	className,
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
			data-ui="PackageCheckoutButton"
			data-action="checkout"
			data-resource-bundle={bundle.bundle}
			data-ui-bundle={bundle.bundle}
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
					bundle: bundle.bundle,
				});
			}}
		>
			<Tx label="Start subscription (button)" />

			<Typo
				data-ui-font="bold"
				label={
					<PriceInline
						price={bundle.price / 100}
						locale={locale}
						currency={bundle.currency.toUpperCase()}
					/>
				}
			/>

			<Tx
				label="Per month (label)"
				data-ui-text="sm"
			/>
		</Button>
	);
};
