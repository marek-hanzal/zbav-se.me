import { type FC, Suspense } from "react";
import { Data } from "./FeedEditorSheetSuspense/Data";
import { Pending } from "./FeedEditorSheetSuspense/Pending";

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
