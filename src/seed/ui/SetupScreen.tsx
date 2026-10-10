import { EmailInput, Select, StatusMessage, TextInput } from "@inkjs/ui";
import { Box, Text } from "ink";
import type { FC } from "react";
import { match } from "ts-pattern";

type FocusField = "count" | "seed" | "submit" | "user";

export namespace SetupScreen {
	export interface Props {
		countInput: string;
		errors: Map<string, string>;
		errorMessage: string | null;
		focusField: FocusField;
		onCountChangeFn(value: string): void;
		onCountSubmitFn(): void;
		onSeedChangeFn(seedId: string): void;
		onUserEmailChangeFn(value: string): void;
		onUserEmailSubmitFn(): void;
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
	onCountChangeFn,
	onCountSubmitFn,
	onSeedChangeFn,
	onUserEmailChangeFn,
	onUserEmailSubmitFn,
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
				flexGrow={1}
			>
				<Text bold>Select seed</Text>
				{match(focusField)
					.with("seed", () => (
						<Select
							defaultValue={selectedSeedId}
							options={seedOptions}
							onChange={onSeedChangeFn}
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
								onCountChangeFn(value.replace(/[^0-9]/g, ""));
							}}
							onSubmit={onCountSubmitFn}
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
							placeholder={"b@x32.cz"}
							onChange={onUserEmailChangeFn}
							onSubmit={onUserEmailSubmitFn}
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

			<Box
				borderColor={match(focusField)
					.with("submit", () => "green")
					.otherwise(() => "gray")}
				borderStyle={"round"}
				paddingX={1}
				paddingY={1}
			>
				<Text
					bold={focusField === "submit"}
					color={match(errors.size)
						.with(0, () => "green")
						.otherwise(() => "gray")}
				>
					{match(errors.size)
						.with(0, () => "Run seed")
						.otherwise(() => "Run seed (disabled)")}
				</Text>
			</Box>

			<Box>
				{match(errors.size)
					.with(0, () => (
						<StatusMessage variant={"success"}>
							Move to Run seed and press Enter to start seeding.
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
