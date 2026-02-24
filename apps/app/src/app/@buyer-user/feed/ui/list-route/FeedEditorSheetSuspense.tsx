import { type FC, Suspense } from "react";
import { Data } from "~/app/@buyer-user/feed/ui/list-route/FeedEditorSheetSuspense/Data";
import { Pending } from "~/app/@buyer-user/feed/ui/list-route/FeedEditorSheetSuspense/Pending";

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
