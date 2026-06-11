import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { CancelIcon } from "~/common/ui/icon";
import { uiSaveButton } from "~/common/ui/ui";
import { withSubscriptionCancelMutation } from "~/user/stripe/mutation/withSubscriptionCancelMutation";
import type { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

export namespace CancelButton {
	export interface Props extends ConfirmButton.Props {
		bundle: ResourceBundleEnumSchema.Type;
	}
}

export const CancelButton: FC<CancelButton.Props> = ({ bundle, className, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const translator = useTranslator();
	const cancelMutation = withSubscriptionCancelMutation.useMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/app/shop/cancelled",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<ConfirmButton
			{...uiSaveButton({})}
			{...props}
			data-ui="CancelButton"
			data-action="cancel subscription renewal"
			data-resource-bundle={bundle}
			data-ui-bundle={bundle}
			data-ui-height="content"
			data-ui-inner="lg"
			iconEnabled={CancelIcon}
			iconProps={{
				"data-ui-text": "xl",
			}}
			loading={cancelMutation.isPending}
			disabled={cancelMutation.isPending || props.disabled}
			className={className}
			buttonProps={{
				children: translator.text("Cancel subscription renewal (button)"),
			}}
			confirmProps={{
				children: translator.text("Confirm cancel subscription renewal (button)"),
				onClick() {
					cancelMutation.mutate({
						bundle,
					});
				},
			}}
		/>
	);
};
