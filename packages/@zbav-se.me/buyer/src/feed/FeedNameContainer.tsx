import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import type { FC } from "react";

export namespace FeedNameContainer {
	export interface Props extends Container.Props {
		value: string;
		onChange(value: string): void;
	}
}

export const FeedNameContainer: FC<FeedNameContainer.Props> = ({ value, onChange, ...props }) => {
	return (
		<Container
			layout={"vertical-centered"}
			items={"center"}
			tone={"unset"}
			theme={"unset"}
			{...props}
		>
			<Status
				textTitle={"Feed name (title)"}
				textMessage={"Feed name (hint)"}
				action={
					<FormField full>
						{(props) => (
							<TextInput
								value={value}
								onChange={(e) => onChange(e.target.value)}
								placeholder={"Feed name (placeholder)"}
								autoFocus={!value}
								{...props}
							/>
						)}
					</FormField>
				}
			/>
		</Container>
	);
};
