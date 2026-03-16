import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { translator } from "@use-pico/common/translator";
import type { StateType } from "@use-pico/common/type";
import { sFeedCreate } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { getFeedDefaultCreate } from "~/app/@common/feed/service/getFeedDefaultCreate";

export namespace CreateSheet {
	export interface Props extends BottomSheet.PropsEx {
		state: StateType.Simple<boolean>;
	}
}

export const CreateSheet: FC<CreateSheet.Props> = ({ state, ...props }) => {
	const [name, setName] = useState("");
	const feedCreateMutation = withFeedQuery.useCreateMutation({
		onSettled() {
			state.set(false);
			setName("");
		},
		invalidate: [
			"collection",
			"count",
		],
	});

	const invalid = !name || name.length < sFeedCreate.properties.name.minLength;

	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => state.set(false)}
			detent={"default"}
			header={({ close }) => ({
				title: "Create new feed (title)",
				right: (
					<CloseButton
						data-action={"close create feed"}
						onClick={close}
					/>
				),
			})}
			{...props}
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
						state.set(false);
					}}
					onSave={() => {
						feedCreateMutation.mutate(getFeedDefaultCreate(name));
					}}
					loading={feedCreateMutation.isPending}
					disabled={invalid || feedCreateMutation.isPending}
				/>
			</Container>
		</BottomSheet>
	);
};
