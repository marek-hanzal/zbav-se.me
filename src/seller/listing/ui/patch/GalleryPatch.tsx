import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { GalleryUpload } from "~/common/gallery/ui/GalleryUpload";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

export namespace GalleryPatch {
	export interface Props extends Container.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		view: useView.Use<"title">;
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({ listing, onCancel, view, ...props }) => {
	const [uploadIds, setUploadIds] = useState<string[]>(listing.withUploadIds);
	const mutation = withListingQuery.usePatchMutation({
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
						setUploadIds(listing.withUploadIds);
						onCancel();
					}}
					onSave={() => {
						mutation.mutate({
							patch: {
								uploadIds,
							},
							query: {
								where: {
									id: listing.id,
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
