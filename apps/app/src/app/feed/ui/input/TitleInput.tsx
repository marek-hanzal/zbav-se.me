import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import type { FC } from "react";

export namespace TitleInput {
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: string;
		onChange(value: string): void;
	}
}

export const TitleInput: FC<TitleInput.Props> = ({ value, onChange, ui, ...props }) => {
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				gap: "md",
				height: "auto",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				textTitle={"Feed title (title)"}
				action={
					<FormField full>
						{(props) => (
							<TextInput
								value={value}
								onChange={(e) => onChange(e.target.value)}
								placeholder={"Feed title (placeholder)"}
								autoFocus={!value}
								{...props}
							/>
						)}
					</FormField>
				}
			>
				<Mx
					label={"Feed title (hint)"}
					tone={"secondary"}
				/>
			</Status>
		</Container>
	);
};
