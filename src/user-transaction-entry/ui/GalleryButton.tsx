import { type FC, useId, useState } from "react";
import { PhotoIcon } from "~/application-ui/constant/icon.exports";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { GalleryUpload } from "~/gallery/ui/GalleryUpload/index";
import { Tx } from "~/translation/ui/Tx";
import { BottomSheet } from "~/ui/ui/BottomSheet";
import { Button } from "~/ui/ui/Button";
import type { TransactionMenuButton } from "~/user-transaction/ui/TransactionMenuButton";
import { withTransactionEntryQuery } from "~/user-transaction-entry/query/withTransactionEntryQuery";
import { withUploadMutation } from "~/user-upload/mutation/withUploadMutation";

export namespace GalleryButton {
	export interface Props extends Button.Props {
		closeFn: TransactionMenuButton.Close;
		transactionId: string;
	}
}

export const GalleryButton: FC<GalleryButton.Props> = ({ closeFn, transactionId, ...props }) => {
	const [isOpen, setIsOpenFn] = useState(false);
	const [uploadIds, setUploadIdsFn] = useState<string[]>([]);
	const mutationId = useId();
	const isUploading = withUploadMutation.useIsMutating({
		mutationId,
	});
	const mutation = withTransactionEntryQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutationFn() {
			setIsOpenFn(false);
			closeFn();
		},
	});

	return (
		<>
			<Button
				iconEnabled={PhotoIcon}
				onClick={() => {
					setIsOpenFn(true);
				}}
				data-ui-tone="primary"
				data-ui-theme="light"
				data-ui-size="xl"
				data-ui-justify="start"
				{...props}
			>
				<Tx label="Upload photos (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpenFn(false);
				}}
				detent={"default"}
			>
				<GalleryUpload
					access="protected"
					state={{
						value: uploadIds,
						setFn: setUploadIdsFn,
					}}
					limit={10}
					mutationId={mutationId}
					data-ui-height="full"
				/>

				<SaveContainer
					onCancelFn={() => {
						setUploadIdsFn([]);
						setIsOpenFn(false);
					}}
					onSaveFn={() => {
						mutation.mutate({
							transactionId,
							kind: "gallery",
							payload: {
								uploadIds,
							},
						});
					}}
					loading={mutation.isPending}
					disabled={isUploading || uploadIds.length === 0}
				/>
			</BottomSheet>
		</>
	);
};
