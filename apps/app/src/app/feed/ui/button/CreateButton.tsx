import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { NameInput } from "../input/NameInput";

export namespace CreateButton {
	export interface Props extends Button.Props {
		onCreate?(feed: tFeed): void;
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ onCreate, ui, className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	const feedCreateMutation = withFeedCreateMutation.useMutation({
		onSuccess(data) {
			onCreate?.(data);
		},
		onSettled() {
			setIsOpen(false);
		},
	});

	return (
		<>
			<Button
				data-ui={"CreateButton[Button]"}
				iconEnabled={FeedIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				onClick={() => setIsOpen(true)}
				label={"Create new feed (title)"}
				ui={{
					tone: "neutral",
					theme: "light",
					justify: "center",
					text: "default",
					size: "lg",
					width: "content",
					...ui,
				}}
				className={[
					"mx-auto",
					className,
				]}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
				header={() => ({
					title: "Create new feed (title)",
				})}
			>
				<NameInput
					onSave={(name) => {
						if (!feedCreateMutation.isPending) {
							feedCreateMutation.mutate({
								name,
								query: {
									where: {
										withIgnored: false,
									},
									sort: [
										{
											field: "createdAt",
											direction: "desc",
										},
										{
											field: "price",
											direction: "asc",
										},
										{
											field: "condition",
											direction: "desc",
										},
										{
											field: "age",
											direction: "desc",
										},
									],
								},
							});
						}
					}}
					defaultValue={""}
					onCancel={() => {
						setIsOpen(false);
					}}
					loading={feedCreateMutation.isPending}
				/>
			</BottomSheet>
		</>
	);
};
