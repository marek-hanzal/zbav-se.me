import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { isValid } from "~/@common/draft/util/isValid";
import type { DraftSchema } from "~/@seller/draft/server/schema/DraftSchema";
import { withListingQuery } from "~/@seller/listing/query/withListingQuery";

export namespace CreateListingButton {
	export interface Props extends Button.Props {
		draft: DraftSchema.Type;
	}
}

export const CreateListingButton: FC<CreateListingButton.Props> = ({
	draft,
	ui,
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
