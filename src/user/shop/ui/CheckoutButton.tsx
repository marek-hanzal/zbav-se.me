import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { CartIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { CancelIcon } from "~/common/ui/icon";
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
	const text = isActive
		? translator.text("Cancel subscription renewal (button)")
		: translator.text("Start subscription (button)");

	return (
		<Button
			{...props}
			data-ui={"CheckoutButton"}
			data-action={isActive ? "cancel subscription renewal" : "checkout"}
			data-resource-bundle={bundle}
			data-ui-bundle={bundle}
			data-ui-tone={isActive ? "neutral" : "brand"}
			data-ui-theme="light"
			data-ui-width="full"
			data-ui-height="content"
			data-ui-inner="lg"
			data-ui-round="xl"
			data-ui-justify="center"
			data-ui-items="center"
			data-ui-gap="default"
			data-ui-text="lg"
			data-ui-font="bold"
			data-ui-border={!isActive}
			data-ui-shadow={true}
			iconEnabled={isActive ? CancelIcon : CartIcon}
			iconProps={{
				"data-ui-text": "xl",
			}}
			loading={isPending}
			disabled={isPending}
			className={[
				"sticky bottom-0 z-10 min-h-14 w-full justify-center rounded-2xl px-5 py-4 text-center text-lg font-bold transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60",
				isActive
					? "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
					: "bg-fuchsia-600 text-white shadow-xl shadow-fuchsia-950/20 hover:bg-fuchsia-500",
				className,
			]}
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
			{text}
		</Button>
	);
};
