import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace NameInput {
	export interface Props extends Omit<Container.Props, "onSubmit" | "onChange"> {
		value: string;
		onChange(value: string): void;
		onSubmit(value: string): void;
		statusProps?: Status.Props;
	}
}

export const NameInput: FC<NameInput.Props> = ({
	value,
	onChange,
	onSubmit,
	statusProps,
	children,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"NameInput[Container]"}
			ui={{
				layout: "vertical-centered",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				data-ui={"NameInput[Status]"}
				icon={FeedIcon}
				textTitle={"Feed name (title)"}
				action={
					<FormField full>
						{(props) => (
							<TextInput
								value={value}
								onChange={(e) => onChange(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										onSubmit(value);
									}
								}}
								placeholder={"Feed name (placeholder)"}
								autoFocus={!value}
								{...props}
							/>
						)}
					</FormField>
				}
				ui={{
					tone: "primary",
					theme: "light",
					inner: "4xl",
				}}
				{...statusProps}
			>
				{children}
			</Status>
		</Container>
	);
};
