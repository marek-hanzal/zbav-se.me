import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { ListItem } from "~/common/list-item/ListItem";
import { useLocale } from "~/locale/hook/useLocale";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { withListingQuery } from "~/seller/listing/query/withListingQuery";
import { Tx } from "~/translation/ui/Tx";
import { PlusIcon } from "~/ui/constant/PlusIcon";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Icon } from "~/ui/ui/Icon";
import { withResourceLimitCheckQuery } from "~/user/resource-limit/query/withResourceLimitCheckQuery";

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
	const { data: resourceLimit } = withResourceLimitCheckQuery.useSuspenseQuery({
		resource: "seller:limit:listing.count",
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
			data-ui={"CreateButton[ListItem]"}
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
