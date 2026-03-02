import { type FC, Suspense } from "react";
import { Data } from "~/app/@seller-user/draft/DraftEditPage/DraftEditor/Data";
import { Pending } from "~/app/@seller-user/draft/DraftEditPage/DraftEditor/Pending";

export namespace DraftEditor {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Orchestrates editing sections and suspense states for the draft workflow.
 * Use it as the top-level editor body for this domain flow.
 *
 * @see apps/app/src/app/@seller-user/draft/page/DraftEditPage.tsx
 */
export const DraftEditor: FC<DraftEditor.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
