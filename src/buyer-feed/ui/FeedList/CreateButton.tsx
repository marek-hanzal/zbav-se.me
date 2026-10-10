import { type FC, useState } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { CreateSheet } from "~/buyer-feed/ui/FeedList/CreateSheet";
import { ListItem } from "~/list-item/ui/ListItem";
import { Tx } from "~/translation/ui/Tx";
import { PlusIcon } from "~/ui/constant/PlusIcon";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Icon } from "~/ui/ui/Icon";
import { withResourceLimitCheckQuery } from "~/user-resource-limit/query/withResourceLimitCheckQuery";

export namespace CreateButton {
	export interface Props extends MarkSuspense.Props, ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ _suspense, className, ...props }) => {
	const [isOpen, setIsOpenFn] = useState(false);
	const { data: feedCount } = withFeedQuery.useCountQuery({
		where: {
			type: "user",
		},
	});
	const { data: resourceLimit } = withResourceLimitCheckQuery.useSuspenseQuery({
		resource: "buyer:limit:feed.count",
		count: feedCount + 1,
	});

	return (
		<>
			<ListItem
				data-ui={"CreateButton[Button]"}
				data-action={"create new feed"}
				data-ui-disabled={!resourceLimit.isAvailable}
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
						label={"Create new feed (title)"}
						data-ui-font="bold"
					/>
				}
				bottom={
					<Tx
						label={"Create new feed (hint)"}
						data-ui-text="sm"
						data-ui-opacity="6"
					/>
				}
				onClick={() => {
					if (!resourceLimit.isAvailable) {
						return;
					}

					setIsOpenFn(true);
				}}
				{...props}
			/>

			<CreateSheet
				_suspense={_suspense}
				state={{
					value: isOpen,
					setFn: setIsOpenFn,
				}}
			/>
		</>
	);
};
