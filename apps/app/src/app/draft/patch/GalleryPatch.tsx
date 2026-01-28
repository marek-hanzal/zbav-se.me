import { useQueryClient } from "@tanstack/react-query";
import type { Container } from "@use-pico/client/ui/container";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
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
	const queryClient = useQueryClient();

	return (
		<TitleContainer
			data-ui={"GalleryPatch-[TitleContainer]"}
			textTitle={"Listing gallery (title)"}
			ui={{
				layout: "vertical-header-content",
				height: "full",
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
				onSuccess={() => {
					withDraftFetchQuery.invalidate(queryClient, {
						where: {
							id: draft.id,
						},
					});
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
