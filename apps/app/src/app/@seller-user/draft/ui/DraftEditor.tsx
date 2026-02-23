import { View } from "@use-pico/client/ui/view";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { createDraftEditorViews } from "~/app/@seller-user/draft/ui/draft-editor/createDraftEditorViews";
import { DraftEditorDefaultView } from "~/app/@seller-user/draft/ui/draft-editor/DraftEditorDefaultView";
import type { DraftEditorView } from "~/app/@seller-user/draft/ui/draft-editor/type";

export namespace DraftEditor {
	export type View = DraftEditorView;

	export interface Props {
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
		onDelete(): Promise<any>;
	}
}

export const DraftEditor: FC<DraftEditor.Props> = ({ draft, onListing, onDelete }) => {
	const [view, setView] = useState<DraftEditorView>("default");

	const views = useMemo(() => {
		return {
			default: {
				children: (
					<DraftEditorDefaultView
						draft={draft}
						onListing={onListing}
						onDelete={onDelete}
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
		onDelete,
		onListing,
	]);

	return (
		<View<DraftEditorView, TitleContainer.Props>
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
