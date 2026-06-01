import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Icon, PlusIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { ListItem } from "~/common/list-item/ListItem";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { useResourceLimit } from "~/user/resource-limit/hook/useResourceLimit";

export namespace CreateButton {
	export interface Props extends MarkSuspense.Props, ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ _suspense, ...props }) => {
	const navigate = useNavigate();
	const locale = useLocale();
	const { data: listingCount } = withListingQuery.useCountQuery({
		where: {
			status: "live",
		},
	});
	const resourceLimit = useResourceLimit({
		_suspense,
		resource: "listing.count",
		count: listingCount,
	});
	const draftCreateMutation = withDraftQuery.useCreateMutation({
		async onPostMutation({ result }) {
			await navigate({
				to: "/$locale/app/seller/draft/$id/edit",
				params: {
					locale,
					id: result.id,
				},
			});
		},
		invalidate: [
			"collection",
			"count",
		],
	});

	return (
		<ListItem
			data-ui={"CreateButton"}
			data-action={"create draft"}
			data-ui-disabled={!resourceLimit.isAvailable}
			onClick={() => {
				if (!resourceLimit.isAvailable) {
					return;
				}

				draftCreateMutation.mutate({});
			}}
			hero={
				<Icon
					icon={PlusIcon}
					data-ui-text="2xl"
					data-ui-color="lead"
					data-ui-opacity="6"
				/>
			}
			title={
				<Tx
					label={"Create new draft (title)"}
					data-ui-font="bold"
				/>
			}
			bottom={
				<Tx
					label={"Create new draft (hint)"}
					data-ui-text="sm"
					data-ui-opacity="6"
				/>
			}
			{...props}
		/>
	);
};
