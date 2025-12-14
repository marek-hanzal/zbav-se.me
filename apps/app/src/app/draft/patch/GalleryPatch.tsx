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
		defaultUploadIds: string[];
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({
	draft,
	onCancel,
	onSuccess,
	ui,
	defaultUploadIds,
	...props
}) => {
	return (
		<Container
			data-ui={"GalleryPatch-[Container]"}
			ui={{
				height: "full",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<GalleryUploadControl
				withMutation={withDraftGalleryCreateMutation}
				toMutation={(uploadIds) => ({
					draftId: draft.id,
					uploadIds,
				})}
				defaultUploadIds={defaultUploadIds}
				onCancel={onCancel}
				onSuccess={onSuccess}
				limit={10}
			/>
		</Container>
	);
};
