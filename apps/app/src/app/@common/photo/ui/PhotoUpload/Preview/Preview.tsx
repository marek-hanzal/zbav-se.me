import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace Preview {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Shows a visual preview of preview content, including loading-aware rendering.
 * Use it to confirm selected media before the final submit action.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const Preview: FC<Preview.Props> = ({ uploadId, ...props }) => {
	if (!uploadId) {
		return null;
	}

	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				uploadId={uploadId}
				{...props}
			/>
		</Suspense>
	);
};
