import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { uiSaveButton } from "~/common/ui/ui";
import { withListingValidationQuery } from "~/seller/listing/query/withListingValidationQuery";
import type { DraftSchema } from "../../server/schema/DraftSchema";

export namespace PublishListingButton {
	export interface Props extends Button.Props {
		draft: DraftSchema.Type;
	}
}

export const PublishListingButton: FC<PublishListingButton.Props> = ({
	draft,
	className,
	...props
}) => {
	const { data: validation } = withListingValidationQuery.useSuspenseQuery({
		listingId: draft.id,
	});

	const navigate = useNavigate();
	const locale = useLocale();
	const mutation = withListingQuery.usePatchMutation({
		async onPostMutation() {
			await navigate({
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
			disabled={!validation.success || mutation.isPending}
			loading={mutation.isPending}
			onClick={() => {
				mutation.mutate({
					patch: {
						status: "live",
					},
					query: {
						where: {
							id: draft.id,
						},
					},
				});
			}}
			{...uiSaveButton({
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
