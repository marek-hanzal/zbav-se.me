import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
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
		setView(view: "title"): void;
		defaultUploadIds: string[];
	}
}

export const GalleryPatch: FC<GalleryPatch.Props> = ({
	listing,
	onCancel,
	setView,
	defaultUploadIds,
	...props
}) => {
	const [uploadIds, setUploadIds] = useState<string[]>(defaultUploadIds);
	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			setView("title");
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
						setUploadIds(defaultUploadIds);
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
