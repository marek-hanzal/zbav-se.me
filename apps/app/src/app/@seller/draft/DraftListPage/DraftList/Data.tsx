import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { type FC, useMemo } from "react";
import { CreateButton } from "../../CreateButton";
import { Empty } from "./Empty";
import { Item } from "./Item";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ _suspense, ui, ...props }) => {
	const { data: draftCollection } = withDraftQuery.useCollectionQuery({
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
			data-ui="DraftList[Container]"
			ui={{
				scroll: "vertical",
				height: "full",
				layout: "vertical-flex",
				gap: "default",
				...ui,
			}}
			{...props}
		>
			<EmptyState check={check}>
				{draftCollection.map((draftId) => (
					<Item
						key={draftId}
						draftId={draftId}
					/>
				))}

				<CreateButton />
			</EmptyState>
		</Container>
	);
};
