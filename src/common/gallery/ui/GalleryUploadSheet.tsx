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

	export interface Props<TData extends Uploads, TResult>
		extends Omit<BottomSheet.Props, "isOpen" | "onClose"> {
		withMutation: withMutation.Api<TData, TResult, any>;
		toMutation(uploadIds: string[]): TData;
		allowClear?: boolean;
		defaultUploadIds: string[];
		limit?: number;
		//
		state: StateType.State<boolean>;
		//
		onSuccess(result: TResult): void;
		onCancel(): void;
	}
}

/**
 * Coordinates the gallery upload flow in a bottom sheet, including local state, mutation submit, and cancel reset.
 * Use it when photo changes should be edited in an isolated overlay and persisted only after explicit save.
 */
export const GalleryUploadSheet = <TData extends GalleryUploadSheet.Uploads, const TResult>({
	withMutation,
	toMutation,
	onSuccess,
	onCancel,
	state,
	allowClear,
	defaultUploadIds,
	limit = 1,
	...props
}: GalleryUploadSheet.Props<TData, TResult>) => {
	const [uploadIds, setUploadIds] = useState<string[]>(defaultUploadIds);
	const mutation = withMutation.useMutation({
		async onPostMutation({ result }) {
			onSuccess(result);
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
					allowClear={allowClear}
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
						mutation.mutateAsync(toMutation(uploadIds));
					}}
					loading={mutation.isPending}
					disabled={!allowClear && uploadIds.length === 0}
				/>
			</Container>
		</BottomSheet>
	);
};
