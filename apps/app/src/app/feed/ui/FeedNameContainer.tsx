import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace FeedNameContainer {
	export interface Props extends Omit<Container.Props, "onSubmit"> {
		value: string;
		onChange(value: string): void;
		onSubmit(value: string): void;
		statusProps?: Status.Props;
	}
}

export const FeedNameContainer: FC<FeedNameContainer.Props> = ({
	value,
	onChange,
	onSubmit,
	statusProps,
	children,
	...props
}) => {
	return (
		<Container
			ui={"FeedNameContainer-root"}
			layout={"vertical-centered"}
			{...props}
		>
			<Status
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
				{...statusProps}
			>
				{children}
			</Status>
		</Container>
	);
};
