import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/feed/ui/list-route/feed-editor-sheet-suspense/Data";
import { Pending } from "~/app/@buyer-user/feed/ui/list-route/feed-editor-sheet-suspense/Pending";

export namespace FeedEditorSheetSuspense {
	export interface Props extends Data.Props {
		//
	}
}

export const FeedEditorSheetSuspense: FC<FeedEditorSheetSuspense.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
