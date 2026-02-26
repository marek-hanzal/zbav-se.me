import { useQueryClient } from "@tanstack/react-query";
import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { GalleryUploadContainer } from "~/app/v0/@common/gallery/ui/GalleryUploadContainer";

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
	const queryClient = useQueryClient();

	return (
		<TitleContainer
			data-ui={"GalleryPatch-[TitleContainer]"}
			textTitle={translator.text("Listing gallery (title)")}
			ui={{
				layout: "vertical-header-content",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<GalleryUploadContainer
				withMutation={withDraftGalleryCreateMutation}
				toMutation={(uploadIds) => ({
					draftId: draft.id,
					uploadIds,
				})}
				defaultUploadIds={defaultUploadIds}
				onCancel={onCancel}
				onSuccess={() => {
					withDraftQuery.invalidateQuery(queryClient, draft.id);
					onSuccess();
				}}
				limit={10}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
