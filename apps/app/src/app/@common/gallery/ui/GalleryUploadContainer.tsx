import type { withMutation } from "@use-pico/client/mutation";
import { Container } from "@use-pico/client/ui/container";
import { useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/app/@common/gallery/ui/GalleryUpload";

export namespace GalleryUploadContainer {
	export interface Uploads {
		uploadIds: string[];
	}

	export interface Props<TData extends Uploads> extends Container.Props {
		withMutation: withMutation.Api<TData, any, any>;
		toMutation(uploadIds: string[]): TData;
		defaultUploadIds: string[];
		//
		onCancel(): void;
		onSuccess(): void;
		limit?: number;
	}
}

export const GalleryUploadContainer = <TData extends GalleryUploadContainer.Uploads>({
	withMutation,
	toMutation,
	defaultUploadIds = [],
	onCancel,
	onSuccess,
	ui,
	limit = 1,
	...props
}: GalleryUploadContainer.Props<TData>) => {
	const [uploadIds, setUploadIds] = useState<string[]>(defaultUploadIds);
	const mutation = withMutation.useMutation({
		async onPostMutation() {
			onSuccess();
		},
	});

	return (
		<Container
			data-ui={"GalleryUploadContainer-[Container]"}
			ui={{
				layout: "vertical-content-footer",
				gap: "default",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<GalleryUpload
				state={{
					value: uploadIds,
					set: setUploadIds,
				}}
				limit={limit}
			/>

			<SaveContainer
				onCancel={() => {
					setUploadIds(defaultUploadIds);
					onCancel();
				}}
				onSave={() => {
					mutation.mutate(toMutation(uploadIds));
				}}
				loading={mutation.isPending}
				disabled={uploadIds.length === 0}
			/>
		</Container>
	);
};
