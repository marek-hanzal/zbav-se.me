import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { zListingCreate } from "@zbav-se.me/sdk/api/seller-user";
import { withListingCreateMutation } from "@zbav-se.me/sdk/mutation/seller-user/listing";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace CreateListingButton {
	export interface Props extends Button.Props {
		draft: tDraft;
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
	const listingCreateMutation = withListingCreateMutation.useMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/seller/listing/my",
				params: {
					locale,
				},
			});
		},
	});

	const listing = zListingCreate.safeParse({
		...draft,
		uploadIds: draft.gallery.items.map((item) => item.uploadId),
		draftId: draft.id,
	});

	return (
		<Button
			iconEnabled={"icon-[solar--globus-linear]"}
			iconProps={{
				ui: {
					text: "2xl",
				},
			}}
			label={translator.text("Submit listing (button)")}
			disabled={!listing.success || listingCreateMutation.isPending}
			loading={listingCreateMutation.isPending}
			onClick={() => {
				if (listing.success) {
					listingCreateMutation.mutate(listing.data);
				}
			}}
			{...uiSaveButton({
				ui: {
					tone: listing.success ? "secondary" : "neutral",
					justify: "start",
					...ui,
				},
				className,
			})}
			{...props}
		/>
	);
};
