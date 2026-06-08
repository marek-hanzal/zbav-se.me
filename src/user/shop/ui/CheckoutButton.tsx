import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { CancelIcon, UnlockIcon } from "~/common/ui/icon";
import { uiCancelButton, uiCtaLinkButton } from "~/common/ui/ui";
import { withCheckoutMutation } from "~/user/stripe/mutation/withCheckoutMutation";
import { withSubscriptionCancelMutation } from "~/user/stripe/mutation/withSubscriptionCancelMutation";
import type { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export namespace CheckoutButton {
	export interface Props extends Button.Props {
		bundle: CheckoutBundleEnumSchema.Type;
		isActive: boolean;
	}
}

export const CheckoutButton: FC<CheckoutButton.Props> = ({
	bundle,
	isActive,
	className,
	...props
}) => {
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
	const cancelMutation = withSubscriptionCancelMutation.useMutation();
	const isPending = checkoutMutation.isPending || cancelMutation.isPending;

	return (
		<Button
			{...(isActive
				? uiCancelButton({
						className,
					})
				: uiCtaLinkButton({
						"data-ui-justify": "center",
						"data-ui-tone": "secondary",
						className,
					}))}
			{...props}
			data-ui={"CheckoutButton"}
			data-action={isActive ? "cancel subscription renewal" : "checkout"}
			data-resource-bundle={bundle}
			data-ui-bundle={bundle}
			iconEnabled={isActive ? CancelIcon : UnlockIcon}
			loading={isPending}
			disabled={isPending}
			onClick={() => {
				if (isActive) {
					cancelMutation.mutate({
						bundle,
					});
					return;
				}

				checkoutMutation.mutate({
					locale,
					bundle,
				});
			}}
		>
			{isActive
				? translator.text("Cancel subscription renewal (button)", "Zrušit obnovování")
				: translator.text("Start subscription (button)", "Zaplatit předplatné")}
		</Button>
	);
};
