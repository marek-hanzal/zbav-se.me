import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { GalleryUpload } from "~/common/gallery/ui/GalleryUpload";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";

export namespace GalleryPatch {
	export interface Props extends Container.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		view: useView.Use<"title">;
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({ draft, onCancel, view, ...props }) => {
	const translator = useTranslator();
	const [uploadIds, setUploadIds] = useState<string[]>(draft.withUploadIds);
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
					limit={10}
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
