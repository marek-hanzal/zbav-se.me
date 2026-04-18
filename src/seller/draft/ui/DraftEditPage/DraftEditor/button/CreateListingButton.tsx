import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { uiSaveButton } from "~/common/ui/ui";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { isValid } from "~/seller/draft/util/isValid";
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

	const valid = isValid(draft);

	return (
		<Button
			data-action={"publish listing"}
			iconEnabled={"icon-[solar--globus-linear]"}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			disabled={!valid.isValid || listingCreateMutation.isPending}
			loading={listingCreateMutation.isPending}
			onClick={() => {
				if (valid.isValid) {
					listingCreateMutation.mutate(valid.data);
				}
			}}
			{...uiSaveButton({
				ui: {
					tone: valid ? "secondary" : "neutral",
					justify: "start",
					...ui,
				},
				className,
			})}
			{...props}
		>
			<Tx label="Submit listing (button)" />
		</Button>
	);
};
