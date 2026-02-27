import type { withMutation } from "@use-pico/client/mutation";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import type { StateType } from "@use-pico/common/type";
import { useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { GalleryUpload } from "~/app/@common/gallery/ui/GalleryUpload";

export namespace GalleryUploadSheet {
	export interface Uploads {
		uploadIds: string[];
	}

	export interface Props<TData extends Uploads>
		extends Omit<BottomSheet.Props, "isOpen" | "onClose"> {
		withMutation: withMutation.Api<TData, any, any>;
		toMutation(uploadIds: string[]): TData;
		defaultUploadIds: string[];
		//
		state: StateType.State<boolean>;
		//
		onSuccess(): void;
		onCancel(): void;
	}
}

export const GalleryUploadSheet = <TData extends GalleryUploadSheet.Uploads>({
	withMutation,
	toMutation,
	onSuccess,
	onCancel,
	state,
	defaultUploadIds,
	...props
}: GalleryUploadSheet.Props<TData>) => {
	const [uploadIds, setUploadIds] = useState<string[]>(defaultUploadIds);
	const mutation = withMutation.useMutation({
		async onPostMutation() {
			onSuccess();
		},
	});

	return (
		<BottomSheet
			detent={"full"}
			isOpen={state.value}
			onClose={() => state.set(false)}
			{...props}
		>
			<Container
				data-ui={"GalleryUploadSheet[Container]"}
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
					limit={1}
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
		</BottomSheet>
	);
};
