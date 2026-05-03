import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { uiSaveButton } from "~/common/ui/ui";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
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
		draftId: draft.id,
	});

	const navigate = useNavigate();
	const locale = useLocale();
	const mutation = withListingQuery.useCreateMutation({
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
					draftId: draft.id,
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
