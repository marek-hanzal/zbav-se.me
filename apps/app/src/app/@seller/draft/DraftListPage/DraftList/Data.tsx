import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import type { FC } from "react";
import { CreateButton } from "../../CreateButton";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ _suspense, ui, ...props }) => {
	const { data } = withDraftQuery.useCollectionQuery({
		where: {
			usedAtIsNull: true,
		},
		sort: [
			{
				field: "updatedAt",
				order: "desc",
			},
		],
	});
	const { data: draftCount } = withDraftQuery.useCountQuery({
		where: {
			usedAtIsNull: true,
		},
	});

	return (
		<Container
			data-ui="DraftList[Container]"
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "default",
				}}
			>
				{draftCount.isEmpty ? (
					<Status
						data-ui="DraftList-[Status.empty]"
						icon={"icon-[streamline--sad-face-remix]"}
						textTitle={translator.text("No drafts (title)")}
						textMessage={translator.text("No drafts (message)")}
					/>
				) : draftCount.isFilterEmpty ? (
					<Status
						data-ui="DraftList-[Status.filter-empty]"
						icon={"icon-[streamline--sad-face-remix]"}
						textTitle={translator.text("No drafts for current filter (title)")}
						textMessage={translator.text("No drafts for current filter (message)")}
					/>
				) : (
					data.map((draftId) => (
						<Item
							key={draftId}
							draftId={draftId}
						/>
					))
				)}

				<CreateButton />
			</Container>
		</Container>
	);
};
