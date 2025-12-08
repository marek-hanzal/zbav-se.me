import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { FeedNameContainer } from "./FeedNameContainer";

export namespace FeedCreateButton {
	export interface Props extends Button.Props {
		onCreate?(feed: tFeed): void;
	}
}

export const FeedCreateButton: FC<FeedCreateButton.Props> = ({ onCreate, ...props }) => {
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
				tone={"primary"}
				iconEnabled={FeedIcon}
				theme={"light"}
				onClick={() => setIsOpen(true)}
				label={"Create new feed (title)"}
				size={"xl"}
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
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"content"}
					square={"md"}
				>
					<FeedNameContainer
						height={"content"}
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
					/>

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"xl"}
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
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
