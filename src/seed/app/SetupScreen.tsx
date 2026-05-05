import { EmailInput, Select, StatusMessage, TextInput } from "@inkjs/ui";
import { Box, Text } from "ink";
import type { FC } from "react";
import { match } from "ts-pattern";

type FocusField = "count" | "seed" | "user";

export namespace SetupScreen {
	export interface Props {
		countInput: string;
		errors: Map<string, string>;
		errorMessage: string | null;
		focusField: FocusField;
		onCountChange(value: string): void;
		onCountSubmit(): void;
		onSeedChange(seedId: string): void;
		onSubmit(): void;
		onUserEmailChange(value: string): void;
		selectedSeedId: string;
		seedOptions: Array<{
			label: string;
			value: string;
		}>;
		userEmailInput: string;
	}
}

export const SetupScreen: FC<SetupScreen.Props> = ({
	countInput,
	errors,
	errorMessage,
	focusField,
	onCountChange,
	onCountSubmit,
	onSeedChange,
	onSubmit,
	onUserEmailChange,
	selectedSeedId,
	seedOptions,
	userEmailInput,
}) => {
	const selectedSeedLabel = match(
		seedOptions.find(
			(item: SetupScreen.Props["seedOptions"][number]) => item.value === selectedSeedId,
		)?.label,
	)
		.with(undefined, () => "Unknown seed")
		.otherwise((label) => label);

	return (
		<Box
			borderColor={"cyan"}
			borderStyle={"round"}
			flexDirection={"column"}
			flexGrow={1}
			paddingX={2}
			paddingY={1}
			gap={1}
		>
			<Text
				bold
				color={"cyan"}
			>
				Seeder
			</Text>

			<Box
				borderColor={match(focusField)
					.with("seed", () => "green")
					.otherwise(() => "gray")}
				borderStyle={"round"}
				flexDirection={"column"}
				paddingX={1}
				paddingY={1}
			>
				<Text bold>Select seed</Text>
				{match(focusField)
					.with("seed", () => (
						<Select
							defaultValue={selectedSeedId}
							options={seedOptions}
							onChange={onSeedChange}
						/>
					))
					.otherwise(() => (
						<Text>{selectedSeedLabel}</Text>
					))}
			</Box>

			<Box
				borderColor={match(focusField)
					.with("count", () => "green")
					.otherwise(() => "gray")}
				borderStyle={"round"}
				flexDirection={"column"}
				paddingX={1}
				paddingY={1}
			>
				<Text bold>Count</Text>
				{match(focusField)
					.with("count", () => (
						<TextInput
							defaultValue={countInput}
							placeholder={"How many listings?"}
							onChange={(value) => {
								onCountChange(value.replace(/[^0-9]/g, ""));
							}}
							onSubmit={onCountSubmit}
						/>
					))
					.otherwise(() => (
						<Text>
							{match(countInput)
								.with("", () => "-")
								.otherwise((value) => value)}
						</Text>
					))}
				{match(errors.get("count"))
					.with(undefined, () => null)
					.otherwise((message) => (
						<Text color={"red"}>{message}</Text>
					))}
			</Box>

			<Box
				borderColor={match(focusField)
					.with("user", () => "green")
					.otherwise(() => "gray")}
				borderStyle={"round"}
				flexDirection={"column"}
				paddingX={1}
				paddingY={1}
			>
				<Text bold>User</Text>
				{match(focusField)
					.with("user", () => (
						<EmailInput
							defaultValue={userEmailInput}
							placeholder={"seed-listings@test.cz"}
							onChange={onUserEmailChange}
							onSubmit={onSubmit}
						/>
					))
					.otherwise(() => (
						<Text>
							{match(userEmailInput)
								.with("", () => "-")
								.otherwise((value) => value)}
						</Text>
					))}
				{match(errors.get("userEmail"))
					.with(undefined, () => null)
					.otherwise((message) => (
						<Text color={"red"}>{message}</Text>
					))}
			</Box>

			<Box>
				{match(errors.size)
					.with(0, () => (
						<StatusMessage variant={"success"}>
							Press Enter on the User field to start seeding.
						</StatusMessage>
					))
					.otherwise(() => (
						<StatusMessage variant={"warning"}>
							Fix validation errors before the seed can run.
						</StatusMessage>
					))}
			</Box>

			{match(errorMessage)
				.with(null, () => null)
				.otherwise((message) => (
					<Box>
						<StatusMessage variant={"error"}>{message}</StatusMessage>
					</Box>
				))}
		</Box>
	);
};
