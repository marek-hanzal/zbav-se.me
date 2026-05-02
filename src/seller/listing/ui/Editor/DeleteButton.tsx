import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { TrashIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import { uiSaveButton } from "~/common/ui/ui";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

export namespace DeleteButton {
	export interface Props extends ConfirmButton.Props {
		listing: ListingSchema.Type;
	}
}

export const DeleteButton: FC<DeleteButton.Props> = ({
	listing,
	buttonProps,
	confirmProps,
	className,
	...props
}) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const mutation = withListingQuery.useDeleteMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/app/home",
				params: {
					locale,
				},
			});
		},
		invalidate: [
			"collection",
		],
	});

	return (
		<ConfirmButton
			iconEnabled={TrashIcon}
			iconProps={{
				"data-ui-text": "2xl",
			}}
			disabled={mutation.isPending}
			loading={mutation.isPending}
			buttonProps={{
				"data-ui-justify": "start",
				"data-ui-items": "center",
				...buttonProps,
			}}
			confirmProps={{
				"data-ui-tone": "danger",
				"data-ui-theme": "light",
				"data-ui-justify": "start",
				"data-ui-items": "center",
				...confirmProps,

				onClick() {
					mutation.mutate({
						where: {
							id: listing.id,
							status: "draft",
						},
					});
				},
				children: translator.text("Delete draft - confirm (button)"),
			}}
			{...uiSaveButton({
				"data-ui-tone": "neutral",
				className,
			})}
			{...props}
		>
			<Tx label={"Delete draft (button)"} />
		</ConfirmButton>
	);
};
