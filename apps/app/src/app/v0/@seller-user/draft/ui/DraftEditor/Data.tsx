import type { MarkSuspense } from "@use-pico/client/type";
import { View } from "@use-pico/client/ui/view";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { useMemo, useState } from "react";
import type { DraftEditor } from "~/app/v0/@seller-user/draft/ui/DraftEditor/DraftEditor";
import { createDraftEditorViews } from "./createDraftEditorViews";
import { DraftEditorDefaultView } from "./DraftEditorDefaultView";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		draftId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, draftId }) => {
	const { data: draft } = withDraftQuery.useFetchQuery(draftId);
	const [view, setView] = useState<DraftEditor.View>("default");

	const views = useMemo(() => {
		return {
			default: {
				children: (
					<DraftEditorDefaultView
						draft={draft}
						onView={setView}
					/>
				),
			},
			...createDraftEditorViews({
				draft,
				onDone: () => setView("default"),
			}),
		};
	}, [
		draft,
	]);

	return (
		<View<DraftEditor.View, TitleContainer.Props>
			state={{
				value: view,
				set: setView,
			}}
			views={views}
		>
			{({ content }) => {
				return content;
			}}
		</View>
	);
};
