import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import { withDraftGalleryCreateMutation } from "@zbav-se.me/sdk/mutation/seller/draft";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/app/@common/gallery/ui/GalleryUpload";
import type { Data } from "../Data";
import { EditAction } from "../EditAction";

export namespace GalleryPatch {
	export interface Props extends Container.Props {
		draft: tDraft;
		onCancel(): void;
		onView(view: Data.View): void;
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
