import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";

export namespace TextInputContainer {
	export interface Props extends Omit<Container.Props, "onSubmit" | "onChange"> {
		defaultValue: string;
		onSave(value: string): void;
		onCancel(): void;
		loading: boolean;
		statusProps?: Status.Props;
		textTitle: string;
		hint?: string;
		placeholder?: string;
		minLength?: number;
	}
}

export const TextInputContainer: FC<TextInputContainer.Props> = ({
	defaultValue,
	onSave,
	onCancel,
	loading,
	statusProps,
	textTitle,
	placeholder,
	hint,
	minLength,
	children,
	ui,
	...props
}) => {
	const [value, setValue] = useState(defaultValue);
	const invalid = minLength != null && (!value || value.length < minLength);

	return (
		<Container
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
					textTitle={textTitle}
					action={
						<FormField>
							{(fieldProps) => (
								<TextInput
									value={value}
									onChange={(e) => {
										setValue(e.target.value);
									}}
									placeholder={placeholder}
									autoFocus
									minLength={minLength}
									{...fieldProps}
								/>
							)}
						</FormField>
					}
					ui={{
						text: "md",
						inner: "4xl",
					}}
					{...statusProps}
				>
					{hint ? (
						<Mx
							label={hint}
							ui={{
								tone: "neutral",
								theme: "light",
							}}
						/>
					) : null}
				</Status>
			</Container>

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					onSave(value);
				}}
				loading={loading}
				disabled={invalid}
			/>
		</Container>
	);
};
