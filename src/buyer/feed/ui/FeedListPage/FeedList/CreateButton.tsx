import { type FC, useState } from "react";
import { Icon, PlusIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { ListItem } from "~/common/list-item/ListItem";
import { useResourceLimit } from "~/common/resource/hook/useResourceLimit";
import { CreateSheet } from "./CreateSheet";

export namespace CreateButton {
	export interface Props extends MarkSuspense.Props, ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ _suspense, className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: feedCount } = withFeedQuery.useCountQuery({
		where: {
			type: "user",
		},
	});
	const resourceLimit = useResourceLimit({
		_suspense,
		resource: "feed.count",
		count: feedCount,
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

					setIsOpen(true);
				}}
				{...props}
			/>

			<CreateSheet
				_suspense={_suspense}
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
