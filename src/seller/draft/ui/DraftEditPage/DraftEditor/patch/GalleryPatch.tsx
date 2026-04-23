import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { GalleryUpload } from "~/common/gallery/ui/GalleryUpload";
import { TitleContainer } from "~/common/ui/container";
import { withDraftGalleryCreateMutation } from "~/seller/draft/mutation/withDraftGalleryCreateMutation";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
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
			data-ui-layout="vertical-header-content"
			data-ui-height="full"
			{...props}
		>
			<Container
				data-ui={"GalleryPatch-[Container]"}
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-gap="default"
				data-ui-inner="default"
			>
				<GalleryUpload
					access="private"
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
