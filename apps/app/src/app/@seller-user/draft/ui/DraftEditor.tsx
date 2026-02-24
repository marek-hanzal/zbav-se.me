import { View } from "@use-pico/client/ui/view";
import type { tDraft, tListing } from "@zbav-se.me/sdk/api/seller-user";
import type { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { createDraftEditorViews } from "~/app/@seller-user/draft/ui/DraftEditor/createDraftEditorViews";
import { DraftEditorDefaultView } from "~/app/@seller-user/draft/ui/DraftEditor/DraftEditorDefaultView";

export namespace DraftEditor {
	export type View =
		| "default"
		| "title"
		| "location"
		| "price"
		| "priceType"
		| "category"
		| "condition"
		| "age"
		| "delivery"
		| "warranty"
		| "restriction"
		| "gallery"
		| "expireAt"
		| "description"
		| "pros"
		| "cons";

	export interface Props {
		draft: tDraft;
		onListing(listing: tListing): Promise<any>;
		onDelete(): Promise<any>;
	}
}

export const DraftEditor: FC<DraftEditor.Props> = ({ draft, onListing, onDelete }) => {
	const [view, setView] = useState<DraftEditor.View>("default");

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
