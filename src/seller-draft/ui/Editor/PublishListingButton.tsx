import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { uiSaveButtonFn } from "~/application-ui/fn/ui.exports";
import { useLocale } from "~/locale/hook/useLocale";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { withListingQuery } from "~/seller-listing/query/withListingQuery";
import { withListingValidationQuery } from "~/seller-listing/query/withListingValidationQuery";
import { Tx } from "~/translation/ui/Tx";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Button } from "~/ui/ui/Button";
import { withResourceLimitCheckQuery } from "~/user-resource-limit/query/withResourceLimitCheckQuery";

export namespace PublishListingButton {
	export interface Props extends MarkSuspense.Props, Button.Props {
		draft: DraftSchema.Type;
	}
}

export const PublishListingButton: FC<PublishListingButton.Props> = ({
	_suspense,
	draft,
	className,
	...props
}) => {
	const { data: validation } = withListingValidationQuery.useSuspenseQuery({
		draftId: draft.id,
	});
	const { data: listingCount } = withListingQuery.useCountQuery({
		where: {
			status: "live",
		},
	});
	const { data: resourceLimit } = withResourceLimitCheckQuery.useSuspenseQuery({
		resource: "seller:limit:listing.count",
		count: listingCount,
	});

	const navigateFn = useNavigate();
	const locale = useLocale();
	const mutation = withListingQuery.useCreateMutation({
		async onPostMutationFn() {
			await navigateFn({
				to: "/$locale/app/seller/listing/my",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<Button
			data-action={"publish draft"}
			iconEnabled={"icon-[solar--cloud-upload-linear]"}
			iconProps={{
				"data-ui-tone": "secondary",
				"data-ui-theme": "light",
				"data-ui-color": "lead",
				"data-ui-text": "2xl",
			}}
			disabled={!validation.success || mutation.isPending || !resourceLimit.isAvailable}
			loading={mutation.isPending}
			onClick={() => {
				if (!resourceLimit.isAvailable) {
					return;
				}

				mutation.mutate({
					draftId: draft.id,
				});
			}}
			{...uiSaveButtonFn({
				"data-ui-tone": "neutral",
				"data-ui-justify": "start",
				className,
			})}
			{...props}
		>
			<Tx
				label="Submit draft (button)"
				data-ui-tone={"secondary"}
				data-ui-theme={"light"}
				data-ui-color={"lead"}
			/>
		</Button>
	);
};
