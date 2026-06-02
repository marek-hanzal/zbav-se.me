import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { UnlockIcon } from "~/common/ui/icon";
import { withBillingCheckoutCreateMutation } from "~/user/billing/mutation/withBillingCheckoutCreateMutation";

export namespace CheckoutButton {
	export interface Props extends Button.Props {
		isBuyerActive: boolean;
	}
}

export const CheckoutButton: FC<CheckoutButton.Props> = ({ isBuyerActive, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const translator = useTranslator();
	const mutation = withBillingCheckoutCreateMutation.useMutation({
		async onPostMutation({ result }) {
			await navigate({
				href: result.url,
			});
		},
	});

	return (
		<Button
			data-ui={"CheckoutButton[Button]"}
			iconEnabled={UnlockIcon}
			loading={mutation.isPending}
			disabled={mutation.isPending || isBuyerActive}
			onClick={() => {
				mutation.mutate({
					locale,
				});
			}}
			{...props}
		>
			{isBuyerActive
				? translator.text("Active", "Active")
				: translator.text("Start Buyer subscription")}
		</Button>
	);
};
