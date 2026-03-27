import type { MarkSuspense } from "@use-pico/client/type";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withFallback } from "@use-pico/client/utils";
import { HeroImage } from "@zbav-se.me/ui/img";
import { withUploadFetchQuery } from "~/user/upload/query/withUploadFetchQuery";

export namespace Preview {
	export interface Props extends MarkSuspense.Props {
		uploadId: string;
	}
}

/**
 * Shows a visual preview of preview content, including loading-aware rendering.
 * Use it to confirm selected media before the final submit action.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const Preview = withFallback(({ _suspense, uploadId }: Preview.Props) => {
	const { data } = withUploadFetchQuery.useSuspenseQuery({
		where: {
			id: uploadId,
		},
	});

	return (
		<HeroImage
			src={data.url}
			alt={data.id}
			visible
			ui={{
				round: "default",
			}}
		/>
	);
}, SpinnerContainer);
