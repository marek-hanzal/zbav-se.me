import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";

export namespace TitleInput {
	export interface Props extends Omit<Container.Props, "onChange"> {
		defaultValue: string;
		onSave(value: string): void;
		onCancel(): void;
		loading: boolean;
	}
}

export const TitleInput: FC<TitleInput.Props> = ({
	defaultValue,
	onSave,
	onCancel,
	loading,
	ui,
	...props
}) => {
	const [title, setTitle] = useState(defaultValue);

	return (
		<Container
			data-ui={"TitleInput[Container]"}
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
					textTitle={"Feed title (title)"}
					action={
						<FormField full>
							{(props) => (
								<TextInput
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder={"Feed title (placeholder)"}
									autoFocus
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
						label={"Feed title (hint)"}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
					/>
				</Status>
			</Container>

			<SaveControl
				onCancel={onCancel}
				onSave={() => {
					onSave(title);
				}}
				loading={loading}
				disabled={false}
			/>
		</Container>
	);
};
