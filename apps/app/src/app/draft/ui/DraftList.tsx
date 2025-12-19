import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tDraft, tDraftQuery } from "@zbav-se.me/sdk/api/user";
import { withDraftCollectionQuery, withDraftFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { CreateButton } from "~/app/draft/button/CreateButton";
import { DraftItem } from "./DraftItem";

export namespace DraftList {
	export interface Props extends Container.Props {
		query: tDraftQuery;
		onSuccess?(draft: tDraft): void;
	}
}

export const DraftList: FC<DraftList.Props> = ({ query, onSuccess, ui, ...props }) => {
	return (
		<Container
			data-root="DraftList[Container]"
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<withDraftCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.data.map(({ id: draftId }) => {
								return (
									<withDraftFetchQuery.Suspense
										key={draftId}
										data={{
											where: {
												id: draftId,
											},
										}}
										fallback={<SpinnerContainer />}
									>
										{({ data: draft }) => {
											return (
												<DraftItem
													key={draftId}
													draft={draft}
												/>
											);
										}}
									</withDraftFetchQuery.Suspense>
								);
							})}

							<CreateButton
								onSuccess={(draft) => {
									onSuccess?.(draft);
								}}
							/>
						</Container>
					);
				}}
			</withDraftCollectionQuery.Suspense>
		</Container>
	);
};
