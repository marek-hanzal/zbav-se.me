import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tDraftQuery } from "@zbav-se.me/sdk/api/user";
import { withDraftCollectionQuery, withDraftFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { DraftItem } from "./DraftItem";

export namespace DraftList {
	export interface Props extends Container.Props {
		query: tDraftQuery;
	}
}

export const DraftList: FC<DraftList.Props> = ({ query, ui, ...props }) => {
	return (
		<Container
			data-root="DraftList[Container]"
			ui={{
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<withDraftCollectionQuery.Suspense
				data={query}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => {
					return data.data.map(({ id: draftId }) => {
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
					});
				}}
			</withDraftCollectionQuery.Suspense>
		</Container>
	);
};
