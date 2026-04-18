import { Suspense, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import { CreateButton } from "../../../ui/CreateButton";
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
 *
 * @see src/draft/page/DraftListPage.tsx
 */
export const DraftList = withFallback(({ _suspense, ...props }: DraftList.Props) => {
	const { data: draftCollection } = withDraftQuery.useIdsQuery({
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
					<Suspense
						key={draftId}
						fallback={<Item.Fallback />}
					>
						<Item
							_suspense={"I know"}
							draftId={draftId}
						/>
					</Suspense>
				))}

				<CreateButton />
			</EmptyState>
		</Container>
	);
}, SpinnerContainer);
