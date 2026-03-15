import { Icon, PlusIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { sFeedCreate } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { getFeedDefaultCreate } from "~/app/@common/feed/service/getFeedDefaultCreate";
import { ListItem } from "~/app/@common/list-item/ListItem";

export namespace CreateButton {
	export interface Props extends ListItem.PropsEx {
		//
	}
}

export const CreateButton: FC<CreateButton.Props> = ({ ui, className, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState("");

	const feedCreateMutation = withFeedQuery.useCreateMutation({
		onSettled() {
			setIsOpen(false);
			setName("");
		},
		invalidate: [
			"collection",
			"count",
		],
	});

	const invalid = !name || name.length < sFeedCreate.properties.name.minLength;

	return (
		<>
			<ListItem
				data-ui={"CreateButton[Button]"}
				hero={
					<Icon
						icon={PlusIcon}
						ui={{
							text: "2xl",
							color: "lead",
							opacity: "6",
						}}
					/>
				}
				title={
					<Tx
						label={"Create new feed (title)"}
						ui={{
							font: "bold",
						}}
					/>
				}
				bottom={
					<Tx
						label={"Create new feed (hint)"}
						ui={{
							text: "sm",
							opacity: "6",
						}}
					/>
				}
				onClick={() => setIsOpen(true)}
				{...props}
			/>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"default"}
				header={({ close }) => ({
					title: "Create new feed (title)",
					right: <CloseButton onClick={close} />,
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
									{(props) => (
										<TextInput
											value={name}
											onChange={(e) => {
												setName(e.target.value);
											}}
											placeholder={translator.text("Feed name (placeholder)")}
											autoFocus
											minLength={sFeedCreate.properties.name.minLength}
											{...props}
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
