import type { MarkSuspense } from "@use-pico/client/type";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { FC } from "react";
import { DraftItem } from "~/app/@seller-user/draft/ui/DraftItem";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		draftId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, draftId }) => {
	const { data: draft } = withDraftFetchQuery.useSuspenseQuery({
		where: {
			id: draftId,
		},
	});

	return <DraftItem draft={draft} />;
};
