import { CloseIcon, PlusIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { sFeedCreate, type tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { type FC, useState } from "react";
import { TextInputContainer } from "~/app/v0/@common/input/ui/TextInputContainer";

export namespace CreateButton {
	export interface Props extends Button.Props {
		isLimitReached: boolean;
		onCreate?(feed: tFeed): void;
	}
}

export const CreateButton: FC<CreateButton.Props> = ({
	isLimitReached,
	onCreate,
	ui,
	className,
	...props
}) => {
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
				onClick={() => setIsOpen(true)}
				ui={{
					tone: "neutral",
					theme: "light",
					round: "lg",
					width: "full",
					size: undefined,
					shadow: true,
					...ui,
				}}
				className={[
					"h-48 md:h-92",
					className,
				]}
				{...props}
			>
				<Container
					ui={{
						tone: "neutral",
						theme: "light",
						width: "full",
						height: "full",
						round: "lg",
						flow: "horizontal",
						items: "center",
						justify: "center",
						background: "default",
						position: "relative",
						opacity: "medium",
					}}
				>
					<Status
						icon={isLimitReached ? CloseIcon : PlusIcon}
						textTitle={
							isLimitReached ? "Limit reached (title)" : "Create new feed (title)"
						}
					/>
				</Container>
			</Button>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
				header={() => ({
					title: "Create new feed (title)",
				})}
			>
				<TextInputContainer
					data-ui={"CreateButton[TextInputContainer]"}
					textTitle={translator.text("Feed name (title)")}
					placeholder={translator.text("Feed name (placeholder)")}
					hint={translator.text("Feed name (required)")}
					minLength={sFeedCreate.properties.name.minLength}
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
											order: "desc",
										},
										{
											field: "price",
											order: "asc",
										},
										{
											field: "condition",
											order: "desc",
										},
										{
											field: "age",
											order: "desc",
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
