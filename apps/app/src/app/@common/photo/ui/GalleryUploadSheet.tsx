import type { withMutation } from "@use-pico/client/mutation";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import type { StateType } from "@use-pico/common/type";
import { GalleryUploadControl } from "./GalleryUploadControl";

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
	return (
		<BottomSheet
			detent={"full"}
			isOpen={state.value}
			onClose={() => state.set(false)}
			{...props}
		>
			<GalleryUploadControl
				withMutation={withMutation}
				toMutation={toMutation}
				onCancel={onCancel}
				onSuccess={onSuccess}
				defaultUploadIds={defaultUploadIds}
				ui={{
					inner: "default",
				}}
			/>
		</BottomSheet>
	);
};
