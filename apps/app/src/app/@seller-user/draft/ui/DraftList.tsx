import { Container } from "@use-pico/client/ui/container";
import type { MarkSuspense } from "@use-pico/client/type";
import type { tDraft, tDraftQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftCollectionQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { type FC, Suspense } from "react";
import { CreateButton } from "~/app/@seller-user/draft/ui/button/CreateButton";
import { DraftListItem } from "~/app/@seller-user/draft/ui/DraftListItem";
import { DraftListItemPending } from "~/app/@seller-user/draft/ui/DraftListItemPending";

export namespace DraftList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		query: tDraftQuery;
		onSuccess?(draft: tDraft): void;
	}
}

export const DraftList: FC<DraftList.Props> = ({
	_suspense,
	query,
	onSuccess,
	ui,
	...props
}) => {
	const { data } = withDraftCollectionQuery.useSuspenseQuery(query);

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
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "default",
				}}
			>
				{data.map(({ id: draftId }) => {
					return (
						<Suspense
							key={draftId}
							fallback={<DraftListItemPending />}
						>
							<DraftListItem
								_suspense={"I know"}
								draftId={draftId}
							/>
						</Suspense>
					);
				})}

				<CreateButton
					onSuccess={(draft) => {
						onSuccess?.(draft);
					}}
				/>
			</Container>
		</Container>
	);
};
