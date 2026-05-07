import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { HeroImage } from "~/common/ui/img";
import { withUploadQuery } from "~/user/upload/query/withUploadQuery";

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
export const Preview = withFallback(({ _suspense, uploadId }: Preview.Props) => {
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
