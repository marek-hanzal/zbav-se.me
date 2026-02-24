import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { FC } from "react";
import { DraftEditor } from "~/app/@seller-user/draft/ui/DraftEditor";

export namespace DraftEditPage {
	export interface Props extends MarkSuspense.Props {
		draftId: string;
	}
}

export const DraftEditPage: FC<DraftEditPage.Props> = ({ _suspense, draftId }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const { data } = withDraftFetchQuery.useSuspenseQuery({
		where: {
			id: draftId,
		},
	});

	return (
		<DraftEditor
			draft={data}
			onListing={async () => {
				await navigate({
					to: "/$locale/flow/seller/listing/my",
					params: {
						locale,
					},
				});
			}}
			onDelete={async () => {
				await navigate({
					to: "/$locale/flow/home",
					params: {
						locale,
					},
				});
			}}
		/>
	);
};
