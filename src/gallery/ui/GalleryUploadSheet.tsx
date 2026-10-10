import { useId, useState } from "react";
import type { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { GalleryUpload } from "~/gallery/ui/GalleryUpload/index";
import type { withMutationFn } from "~/mutation/fn/withMutationFn";
import type { StateType } from "~/ui/type/StateType";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Container } from "~/ui/ui/Container";
import { withUploadMutation } from "~/user-upload/mutation/withUploadMutation";

export namespace GalleryUploadSheet {
	export interface Uploads {
		uploadIds: string[];
	}

	export interface Props<TData extends Uploads, TResult>
		extends Omit<BottomSheet.Props, "isOpen" | "onClose"> {
		withMutation: withMutationFn.Api<TData, TResult, any>;
		toMutationFn(uploadIds: string[]): TData;
		allowClear?: boolean;
		defaultUploadIds: string[];
		limit?: number;
		access: AccessEnumSchema.Type;
		//
		state: StateType.State<boolean>;
		//
		onSuccessFn(result: TResult): void;
		onCancelFn(): void;
	}
}

/**
 * Coordinates the gallery upload flow in a bottom sheet, including local state, mutation submit, and cancel reset.
 * Use it when photo changes should be edited in an isolated overlay and persisted only after explicit save.
 */
export const GalleryUploadSheet = <TData extends GalleryUploadSheet.Uploads, const TResult>({
	withMutation,
	toMutationFn,
	onSuccessFn,
	onCancelFn,
	state,
	allowClear,
	defaultUploadIds,
	limit = 1,
	access,
	...props
}: GalleryUploadSheet.Props<TData, TResult>) => {
	const [uploadIds, setUploadIdsFn] = useState<string[]>(defaultUploadIds);
	const mutationId = useId();
	const isUploading = withUploadMutation.useIsMutating({
		mutationId,
	});
	const mutation = withMutation.useMutation({
		async onPostMutationFn({ result }) {
			onSuccessFn(result);
		},
	});

	return (
		<BottomSheet
			detent={"full"}
			isOpen={state.value}
			onClose={() => state.setFn(false)}
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
					access={access}
					state={{
						value: uploadIds,
						setFn: setUploadIdsFn,
					}}
					limit={limit}
					mutationId={mutationId}
				/>

				<SaveContainer
					onCancelFn={() => {
						setUploadIdsFn(defaultUploadIds);
						onCancelFn();
					}}
					onSaveFn={() => {
						mutation.mutateAsync(toMutationFn(uploadIds));
					}}
					loading={mutation.isPending}
					disabled={isUploading || (!allowClear && uploadIds.length === 0)}
				/>
			</Container>
		</BottomSheet>
	);
};
