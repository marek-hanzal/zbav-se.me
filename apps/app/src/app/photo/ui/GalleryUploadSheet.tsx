import type { withMutation } from "@use-pico/client/mutation";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { tvc } from "@use-pico/cls";
import type { StateType } from "@use-pico/common/type";
import { useState } from "react";
import { GalleryUpload } from "./GalleryUpload";

export namespace GalleryUploadSheet {
	export interface Uploads {
		uploadIds: string[];
	}

	export interface Props<TData extends Uploads>
		extends Omit<BottomSheet.Props, "isOpen" | "onClose"> {
		withMutation: withMutation.Api<TData, any, any>;
		toMutation(uploadIds: string[]): TData;
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
	...props
}: GalleryUploadSheet.Props<TData>) => {
	const [uploadIds, setUploadIds] = useState<string[]>([]);
	const mutation = withMutation.useMutation({
		async onPostMutation() {
			state.set(false);
			setUploadIds([]);
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
				layout={"vertical-content-footer"}
				gap={"md"}
				square={"md"}
				tone={"unset"}
				theme={"unset"}
			>
				<GalleryUpload
					state={{
						value: uploadIds,
						set: setUploadIds,
					}}
					limit={1}
				/>

				<div
					className={tvc([
						"flex",
						"flex-row",
						"gap-2",
						"items-center",
						"justify-center",
					])}
				>
					<ConfirmButton
						label={"Cancel (button)"}
						tone={"primary"}
						theme={"light"}
						size={"xl"}
						full
						confirmProps={{
							tone: "danger",
							theme: "dark",
							onClick() {
								state.set(false);
								setUploadIds([]);
								onCancel();
							},
						}}
						disabled={mutation.isPending}
					/>

					<Button
						label={"Upload gallery (button)"}
						size={"xl"}
						full
						tone={"secondary"}
						theme={"light"}
						disabled={mutation.isPending || uploadIds.length === 0}
						loading={mutation.isPending}
						onClick={() => {
							mutation.mutate(toMutation(uploadIds));
						}}
					/>
				</div>
			</Container>
		</BottomSheet>
	);
};
