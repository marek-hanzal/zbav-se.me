import type { FC } from "react";
import { DraftEditor } from "./DraftEditor";

export namespace DraftEditPage {
	export interface Props {
		draftId: string;
	}
}

/**
 * Composes the route-level draft edit screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the draft edit journey.
 *
 * @see apps/app/src/app//draft/page/DraftEditPage.tsx
 */
export const DraftEditPage: FC<DraftEditPage.Props> = ({ draftId }) => {
	return <DraftEditor draftId={draftId} />;
};
