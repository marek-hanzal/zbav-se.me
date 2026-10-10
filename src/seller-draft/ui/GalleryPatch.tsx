import { type FC, useState } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { GalleryUpload } from "~/gallery/ui/GalleryUpload/index";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { withResourceLimitCheckQuery } from "~/user-resource-limit/query/withResourceLimitCheckQuery";
import type { useView } from "~/view/hook/useView";

export namespace GalleryPatch {
	export interface Props extends MarkSuspense.Props, Container.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"title">;
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({
	_suspense,
	draft,
	onCancel,
	view,
	...props
}) => {
	const translator = useTranslator();
	const [uploadIds, setUploadIds] = useState<string[]>(draft.withUploadIds);
	const { data: resourceLimit } = withResourceLimitCheckQuery.useSuspenseQuery({
		resource: "seller:limit:listing.gallery.count",
		count: uploadIds.length,
	});
	const galleryLimit = Math.max(uploadIds.length, Math.floor(resourceLimit.limit), 1);
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.set("title");
		},
		invalidate: [
			"collection",
		],
	});

	return (
		<TitleContainer
			data-ui={"GalleryPatch"}
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
					limit={galleryLimit}
				/>

				<SaveContainer
					onCancel={() => {
						setUploadIds(draft.withUploadIds);
						onCancel();
					}}
					onSave={() => {
						mutation.mutate({
							patch: {
								uploadIds,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={uploadIds.length === 0 || mutation.isPending}
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
