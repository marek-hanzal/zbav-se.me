import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tDraftQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { FC } from "react";
import { CreateButton } from "./button/CreateButton";
import { DraftListItemSuspense } from "./DraftListItemSuspense";

export namespace DraftList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tDraftQuery;
		onSuccess?(draft: tDraft): void;
	}
}

export const DraftList: FC<DraftList.Props> = ({ _suspense, query, onSuccess, ui, ...props }) => {
	const { data } = withDraftQuery.useCollectionQuery(query);
	const { data: draftCount } = withDraftQuery.useCount(query);

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
						data.map((draftId) => {
							return (
								<DraftListItemSuspense
									key={draftId}
									draftId={draftId}
								/>
							);
						})
					)}

					<CreateButton
						onSuccess={(draft) => {
							onSuccess?.(draft);
						}}
					/>
				</Container>
			</Container>
		);
	};
