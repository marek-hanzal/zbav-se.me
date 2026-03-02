import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/app/@common/gallery/ui/GalleryUpload";
import { EditAction } from "../EditAction";

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
	const [uploadIds, setUploadIds] = useState<string[]>(defaultUploadIds);
	const mutation = withDraftGalleryCreateMutation.useMutation({
		onSuccess,
	});

	return (
		<TitleContainer
			data-ui={"GalleryPatch-[TitleContainer]"}
			textTitle={translator.text("Listing gallery (title)")}
			left={<EditAction />}
			ui={{
				layout: "vertical-header-content",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"GalleryPatch-[Container]"}
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					gap: "default",
					inner: "default",
				}}
			>
				<GalleryUpload
					state={{
						value: uploadIds,
						set: setUploadIds,
					}}
					limit={10}
				/>

				<SaveContainer
					onCancel={() => {
						setUploadIds(defaultUploadIds);
						onCancel();
					}}
					onSave={() => {
						mutation.mutate({
							draftId: draft.id,
							uploadIds,
						});
					}}
					loading={mutation.isPending}
					disabled={uploadIds.length === 0}
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};
