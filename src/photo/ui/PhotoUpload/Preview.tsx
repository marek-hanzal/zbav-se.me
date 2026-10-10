import { HeroImage } from "~/application-ui/ui/img.exports";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { withUploadQuery } from "~/user-upload/query/withUploadQuery";

export namespace Preview {
	export interface Props extends MarkSuspense.Props {
		uploadId: string;
	}
}

/**
 * Shows a visual preview of preview content, including loading-aware rendering.
 * Use it to confirm selected media before the final submit action.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const Preview = withFallbackFn(({ _suspense, uploadId }: Preview.Props) => {
	const { data } = withUploadQuery.useFetchQuery(uploadId);

	return (
		<HeroImage
			src={data.url}
			alt={data.id}
			visible
			data-ui-round="default"
		/>
	);
}, SpinnerContainer);
