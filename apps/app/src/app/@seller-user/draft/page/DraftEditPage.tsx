import type { FC } from "react";
import { DraftEditor } from "~/app/v0/@seller-user/draft/ui/DraftEditor/DraftEditor";

export namespace DraftEditPage {
	export interface Props {
		draftId: string;
	}
}

export const DraftEditPage: FC<DraftEditPage.Props> = ({ draftId }) => {
	return <DraftEditor draftId={draftId} />;
};
