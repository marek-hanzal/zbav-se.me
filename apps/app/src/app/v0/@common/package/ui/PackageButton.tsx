import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withMessageQuery } from "@zbav-se.me/sdk/query/user/message";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { useState } from "react";
import { PackageControl } from "./PackageControl";

export namespace PackageButton {
	export interface Props extends Button.Props {
		transactionId: string;
	}
}

export const PackageButton: FC<PackageButton.Props> = ({ transactionId, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const mutation = withMessageQuery.useCreateMutation({
		invalidate: [
			"collection",
			"count",
		],
		async onPostMutation() {
			setIsOpen(false);
		},
	});

	return (
		<>
			<Button
				data-ui="PackageButton[Button]"
				iconEnabled={SendPackageIcon}
				onClick={() => {
					setIsOpen(true);
				}}
				{...props}
			>
				<Tx label="Share package (button)" />
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => {
					setIsOpen(false);
				}}
				detent={"full"}
				withHeader
				header={() => ({
					title: "Share package (title)",
				})}
			>
				<PackageControl
					data-ui="PackageButton[PackageControl]"
					onCancel={() => {
						setIsOpen(false);
					}}
					onSave={({ link, number }) => {
						return mutation.mutateAsync({
							type: "package",
							transactionId,
							link,
							number,
						});
					}}
					loading={mutation.isPending}
					ui={{
						inner: "default",
					}}
				/>
			</BottomSheet>
		</>
	);
};
