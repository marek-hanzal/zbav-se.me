import { CloseIcon, PlusIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { translator } from "@use-pico/common/translator";
import { sFeedCreate, type tFeed } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { getFeedDefaultCreate } from "~/app/@common/feed/service/getFeedDefaultCreate";

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
	const [name, setName] = useState("");

	const feedCreateMutation = withFeedQuery.useCreateMutation({
		onSuccess: onCreate,
		onSettled() {
			setIsOpen(false);
		},
	});

	const invalid = !name || name.length < sFeedCreate.properties.name.minLength;

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
						opacity: "6",
					}}
				>
					<Status
						icon={isLimitReached ? CloseIcon : PlusIcon}
						textTitle={translator.text(
							isLimitReached ? "Limit reached (title)" : "Create new feed (title)",
						)}
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
				<Container
					data-ui={"CreateButton[TextInputContainer]"}
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						width: "full",
						inner: "default",
					}}
				>
					<Container
						ui={{
							layout: "vertical-centered",
							height: "full",
						}}
					>
						<Status
							textTitle={translator.text("Feed name (title)")}
							action={
								<FormField>
									{(fieldProps) => (
										<TextInput
											value={name}
											onChange={(e) => {
												setName(e.target.value);
											}}
											placeholder={translator.text("Feed name (placeholder)")}
											autoFocus
											minLength={sFeedCreate.properties.name.minLength}
											{...fieldProps}
										/>
									)}
								</FormField>
							}
							ui={{
								text: "md",
								inner: "4xl",
							}}
						>
							<Mx
								label={translator.text("Feed name (required)")}
								ui={{
									tone: "neutral",
									theme: "light",
								}}
							/>
						</Status>
					</Container>

					<SaveContainer
						onCancel={() => {
							setIsOpen(false);
						}}
						onSave={() => {
							feedCreateMutation.mutate(getFeedDefaultCreate(name));
						}}
						loading={feedCreateMutation.isPending}
						disabled={invalid || feedCreateMutation.isPending}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
