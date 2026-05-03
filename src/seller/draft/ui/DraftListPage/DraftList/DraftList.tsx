import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import type { MarkSuspense } from "@/lib/client/type";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { CreateButton } from "./CreateButton";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace DraftList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

/**
 * Coordinates draft list loading through suspense and renders resolved draft rows via the data layer.
 * Use it in seller draft screens where async list fetching needs a dedicated pending fallback.
 */
export const DraftList: FC<DraftList.Props> = ({ _suspense, ...props }: DraftList.Props) => {
	const { data: draftCollection } = withDraftQuery.useCollectionQuery({
		sort: [
			{
				field: "updatedAt",
				order: "desc",
			},
		],
	});

	const check = useMemo(() => {
		return [
			{
				check() {
					return !draftCollection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] as EmptyState.Check[];
	}, [
		draftCollection,
	]);

	return (
		<Container
			data-ui="DraftList"
			data-ui-scroll="vertical"
			data-ui-height="full"
			data-ui-layout="vertical-flex"
			data-ui-gap="default"
			{...props}
		>
			<EmptyState check={check}>
				{draftCollection.map((draft) => (
					<Item
						key={`draft-${draft.id}`}
						_suspense={_suspense}
						draft={draft}
					/>
				))}

				<CreateButton />
			</EmptyState>
		</Container>
	);
};
