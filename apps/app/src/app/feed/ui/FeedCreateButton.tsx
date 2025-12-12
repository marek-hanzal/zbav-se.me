import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { FeedName } from "./FeedName";

export namespace FeedCreateButton {
	export interface Props extends Button.Props {
		onCreate?(feed: tFeed): void;
	}
}

export const FeedCreateButton: FC<FeedCreateButton.Props> = ({ onCreate, ui, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");
	const [change, setChange] = useState(false);

	const feedCreateMutation = withFeedCreateMutation.useMutation({
		onSuccess(data) {
			onCreate?.(data);
		},
		onSettled() {
			setChange(false);
			setIsOpen(false);
			setName("");
		},
	});

	return (
		<>
			<Button
				iconEnabled={FeedIcon}
				onClick={() => setIsOpen(true)}
				label={"Create new feed (title)"}
				ui={{
					tone: "primary",
					theme: "light",
					size: "xl",
					...ui,
				}}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
				header={{
					close: true,
					title: "Create new feed (title)",
				}}
			>
				<Container
					data-ui={"FeedCreateButton-Container"}
					ui={{
						layout: "vertical-content-footer",
						gap: "default",
					}}
				>
					<FeedName
						value={name}
						onChange={(value) => {
							setChange(true);
							setName(value);
						}}
						onSubmit={(name) => {
							if (change && name && !feedCreateMutation.isPending) {
								toast.promise(
									feedCreateMutation.mutateAsync({
										name,
										query: {
											where: {
												withOwn: false,
											},
										},
									}),
									{
										loading: translator.text("Loading... (toast)"),
										success: translator.text("Feed created (toast)"),
										error: translator.text("Error creating feed (toast)"),
									},
								);
							}
						}}
						ui={{
							height: "content",
						}}
					/>

					<Button
						label={"Feed - save (button)"}
						loading={feedCreateMutation.isPending}
						disabled={!change || !name || feedCreateMutation.isPending}
						onClick={() => {
							toast.promise(
								feedCreateMutation.mutateAsync({
									name,
									query: {
										where: {
											withOwn: false,
										},
									},
								}),
								{
									loading: translator.text("Loading... (toast)"),
									success: translator.text("Feed created (toast)"),
									error: translator.text("Error creating feed (toast)"),
								},
							);
						}}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
