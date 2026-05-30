import { type FC, useState } from "react";
import { Icon, PlusIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { ListItem } from "~/common/list-item/ListItem";
import { useResourceLimit } from "~/user/user-resource/hook/useResourceLimit";
import { CreateSheet } from "./CreateSheet";

export namespace CreateButton {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { data: feedCount } = withFeedQuery.useCountQuery({
		filter: {
			type: "user",
		},
	});
	const resourceLimit = useResourceLimit({
		resource: "feed.count",
		count: feedCount,
	});
	const disabled = resourceLimit.isLoading || !resourceLimit.isAvailable;

	return (
		<>
			<ListItem
				data-ui={"CreateButton[Button]"}
				data-action={"create new feed"}
				data-ui-disabled={disabled}
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
					if (disabled) {
						return;
					}

					setIsOpen(true);
				}}
				{...props}
			/>

			<CreateSheet
				state={{
					value: isOpen,
					set: setIsOpen,
				}}
			/>
		</>
	);
};
