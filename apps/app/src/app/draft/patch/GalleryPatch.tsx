import { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { withDraftGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import type { FC } from "react";
import { GalleryUploadControl } from "~/app/photo/ui/GalleryUploadControl";

export namespace GalleryPatch {
	export interface Props extends Container.Props {
		draft: tDraft;
		onCancel(): void;
		onSuccess(): void;
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({ draft, onCancel, onSuccess, ...props }) => {
	return (
		<Container
			data-ui={"GalleryPatch-[Container]"}
			{...props}
		>
			<GalleryUploadControl
				withMutation={withDraftGalleryCreateMutation}
				toMutation={(uploadIds) => ({
					draftId: draft.id,
					uploadIds,
				})}
				onCancel={onCancel}
				onSuccess={onSuccess}
			/>
		</Container>
	);
};
