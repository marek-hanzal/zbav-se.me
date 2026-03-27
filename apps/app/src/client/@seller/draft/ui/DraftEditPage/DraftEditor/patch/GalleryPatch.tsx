import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/client/@common/gallery/ui/GalleryUpload";
import { withDraftGalleryCreateMutation } from "~/client/@seller/draft/withDraftGalleryCreateMutation";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

export namespace GalleryPatch {
	export interface Props extends Container.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
		defaultUploadIds: string[];
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({
	draft,
	onCancel,
	onView,
	ui,
	defaultUploadIds,
	...props
}) => {
	const [uploadIds, setUploadIds] = useState<string[]>(defaultUploadIds);
	const invalidate = withDraftQuery.useInvalidator();
	const mutation = withDraftGalleryCreateMutation.useMutation({
		async onPostMutation() {
			return invalidate(
				[
					"fetch",
				],
				{
					fetch: {
						where: {
							id: draft.id,
						},
					},
				},
			);
		},
		onSuccess() {
			onView("title");
		},
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
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
