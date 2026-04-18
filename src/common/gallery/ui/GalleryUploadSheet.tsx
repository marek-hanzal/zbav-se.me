import { useState } from "react";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import type { withMutation } from "@/lib/client/mutation";
import type { StateType } from "@/lib/client/type";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { GalleryUpload } from "~/common/gallery/ui/GalleryUpload";

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

/**
 * Coordinates the gallery upload flow in a bottom sheet, including local state, mutation submit, and cancel reset.
 * Use it when photo changes should be edited in an isolated overlay and persisted only after explicit save.
 *
 * @see src/draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
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
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-gap="default"
				data-ui-inner="default"
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
