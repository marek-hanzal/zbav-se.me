import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { sFeedCreate } from "@zbav-se.me/sdk/api/session";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace NameInput {
	export interface Props extends Omit<Container.Props, "onSubmit" | "onChange"> {
		defaultValue: string;
		onSave(value: string): void;
		onCancel(): void;
		loading: boolean;
		statusProps?: Status.Props;
	}
}

export const NameInput: FC<NameInput.Props> = ({
	defaultValue,
	onSave,
	onCancel,
	loading,
	statusProps,
	children,
	ui,
	...props
}) => {
	const [name, setName] = useState(defaultValue);

	return (
		<Container
			data-ui={"NameInput[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<Status
					textTitle={"Feed name (title)"}
					action={
						<FormField>
							{(props) => (
								<TextInput
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
									placeholder={"Feed name (placeholder)"}
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
						label={"Feed name (required)"}
						ui={{
							tone: "neutral",
							theme: "light",
						}}
					/>
				</Status>
			</Container>

			<SaveControl
				onCancel={onCancel}
				onSave={() => {
					onSave(name);
				}}
				loading={loading}
				disabled={!name || name.length < sFeedCreate.properties.name.minLength}
			/>
		</Container>
	);
};
