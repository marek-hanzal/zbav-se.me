import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { UnlockIcon } from "~/common/ui/icon";
import { withCheckoutMutation } from "~/user/stripe/mutation/withCheckoutMutation";
import type { CheckoutBundleEnumSchema } from "~/user/stripe/server/schema/CheckoutBundleEnumSchema";

export namespace CheckoutButton {
	export interface Props extends Button.Props {
		bundle: CheckoutBundleEnumSchema.Type;
		isActive: boolean;
	}
}

export const CheckoutButton: FC<CheckoutButton.Props> = ({ bundle, isActive, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const translator = useTranslator();
	const mutation = withCheckoutMutation.useMutation({
		async onPostMutation({ result }) {
			await navigate({
				href: result.url,
			});
		},
	});

	return (
		<Button
			{...props}
			data-ui={"CheckoutButton"}
			data-action={"checkout"}
			data-resource-bundle={bundle}
			data-ui-bundle={bundle}
			iconEnabled={UnlockIcon}
			loading={mutation.isPending}
			disabled={mutation.isPending || isActive}
			onClick={() => {
				mutation.mutate({
					locale,
					bundle,
				});
			}}
		>
			{isActive
				? translator.text("Subscription already active (label)")
				: translator.text("Start subscription (label)")}
		</Button>
	);
};
