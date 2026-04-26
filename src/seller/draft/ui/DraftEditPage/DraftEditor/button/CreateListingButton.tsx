import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { uiSaveButton } from "~/common/ui/ui";
import { useIsValid } from "~/seller/draft/hook/useIsValid";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";

export namespace CreateListingButton {
	export interface Props extends Button.Props {
		draft: DraftSchema.Type;
	}
}

export const CreateListingButton: FC<CreateListingButton.Props> = ({
	draft,
	className,
	...props
}) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const listingCreateMutation = withListingQuery.useCreateMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/app/seller/listing/my",
				params: {
					locale,
				},
			});
		},
	});

	const valid = useIsValid({
		draft,
	});

	return (
		<Button
			data-action={"publish listing"}
			iconEnabled={"icon-[solar--globus-linear]"}
			iconProps={{
				"data-ui-text": "2xl",
			}}
			disabled={!valid.isValid || listingCreateMutation.isPending}
			loading={listingCreateMutation.isPending}
			onClick={() => {
				if (valid.isValid) {
					listingCreateMutation.mutate(valid.data);
				}
			}}
			{...uiSaveButton({
				"data-ui-tone": valid ? "secondary" : "neutral",
				"data-ui-justify": "start",
				className,
			})}
			{...props}
		>
			<Tx label="Submit listing (button)" />
		</Button>
	);
};
