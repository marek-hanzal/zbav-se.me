import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { CartIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { uiSaveButton } from "~/common/ui/ui";
import { withCheckoutMutation } from "~/user/stripe/mutation/withCheckoutMutation";
import type { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export namespace CheckoutButton {
	export interface Props extends Button.Props {
		bundle: CheckoutBundleEnumSchema.Type;
	}
}

export const CheckoutButton: FC<CheckoutButton.Props> = ({ bundle, className, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const translator = useTranslator();
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
			data-ui="CheckoutButton"
			data-action="checkout"
			data-resource-bundle={bundle}
			data-ui-bundle={bundle}
			data-ui-height="content"
			data-ui-inner="lg"
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
			{translator.text("Start subscription (button)")}
		</Button>
	);
};
