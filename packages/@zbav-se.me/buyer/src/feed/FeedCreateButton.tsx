import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
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
				theme={"dark"}
				onClick={() => setIsOpen(true)}
				label={"Create new feed (title)"}
				size={"lg"}
				full
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"fit"}
					tone={"unset"}
					theme={"unset"}
					square={"md"}
				>
					<FeedNameContainer
						height={"fit"}
						value={name}
						onChange={(value) => {
							setChange(true);
							setName(value);
						}}
					/>

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"lg"}
						loading={feedCreateMutation.isPending}
						disabled={!change || !name || feedCreateMutation.isPending}
						full
						onClick={() => {
							feedCreateMutation.mutate({
								name,
								query: {},
							});
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
