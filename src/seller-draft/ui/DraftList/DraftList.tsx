import { type FC, useMemo } from "react";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import { CreateButton } from "~/seller-draft/ui/DraftList/CreateButton";
import { Empty } from "~/seller-draft/ui/DraftList/Empty";
import { Item } from "~/seller-draft/ui/DraftList/Item";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";

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
				checkFn() {
					return !draftCollection.length;
				},
				renderFn() {
					return <Empty />;
				},
			},
		] as EmptyState.Check[];
	}, [
		draftCollection,
	]);

	return (
		<Container
			data-ui="DraftList[Container]"
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

				<CreateButton _suspense={_suspense} />
			</EmptyState>
		</Container>
	);
};
