import type { FC } from "react";
import { z } from "zod";
import { BottomSheet } from "@/lib/client/bottom-sheet";
import { Container } from "@/lib/client/container";
import { ErrorBadge } from "@/lib/client/error";
import { FormField } from "@/lib/client/form";
import { onSubmit } from "@/lib/client/submit";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { StateType } from "@/lib/client/type";
import { CloseButton } from "~/common/ui/button";
import { useAppForm } from "~/common/ui/form";
import { withPasswordChangeMutation } from "~/user/auth/mutation/withPasswordChangeMutation";

const useFormSchema = () => {
	const translator = useTranslator();

	return z
		.looseObject({
			current: z.string().min(1),
			password: z.string().min(8, {
				error() {
					return translator.text("Password must be at least 8 characters");
				},
			}),
			confirmPassword: z.string().min(1, {
				error() {
					return translator.text("Password confirmation is required");
				},
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: translator.text("Passwords do not match"),
			path: [
				"confirmPassword",
			],
		})
		.strip();
};

type FormSchema = ReturnType<typeof useFormSchema>;

export namespace ChangePasswordSheet {
	export interface Props extends BottomSheet.PropsEx {
		state: StateType.Simple<boolean>;
	}
}

export const ChangePasswordSheet: FC<ChangePasswordSheet.Props> = ({ state, ...props }) => {
	const translator = useTranslator();
	const schema = useFormSchema();

	const mutation = withPasswordChangeMutation.useMutation({
		onSuccess() {
			state.set(false);
		},
	});

	const form = useAppForm({
		defaultValues: {
			current: "",
			password: "",
			confirmPassword: "",
		} satisfies z.infer<FormSchema>,
		validators: {
			onSubmit: schema,
		},
		onSubmit: onSubmit({
			mutation,
		}),
	});

	return (
		<BottomSheet
			isOpen={state.value}
			onClose={() => {
				state.set(false);
			}}
			header={({ close }) => ({
				title: translator.text("Change password (title)"),
				right: <CloseButton onClick={close} />,
			})}
			{...props}
		>
			<Container
				data-ui-flow="vertical"
				data-ui-gap="default"
				data-ui-inner="default"
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className={"contents"}
				>
					<form.AppField name={"current"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Current password (label)"} />}
								meta={field.state.meta}
							>
								{(props) => (
									<field.TextInput
										type={"password"}
										autoFocus
										placeholder={translator.text(
											"Enter you current password (placeholder)",
										)}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>

					<form.AppField name={"password"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Password"} />}
								meta={field.state.meta}
							>
								{(props) => (
									<field.TextInput
										type={"password"}
										autoComplete={"new-password"}
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder={translator.text("Enter your password")}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>

					<form.AppField name={"confirmPassword"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Confirm Password"} />}
								meta={field.state.meta}
							>
								{(props) => (
									<field.TextInput
										type={"password"}
										autoComplete={"new-password"}
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder={translator.text("Confirm your password")}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>

					<Container
						data-ui-layout="vertical-flex"
						data-ui-width="full"
						data-ui-items="center"
						data-ui-gap="default"
					>
						<form.Subscribe
							selector={(state) => ({
								isValid: state.isValid,
								isSubmitting: state.isSubmitting,
							})}
						>
							{({ isValid, isSubmitting }) => {
								return (
									<>
										<form.SubmitButton
											data-action={"sign up"}
											iconEnabled={
												"icon-[solar--key-minimalistic-square-linear]"
											}
											disabled={!isValid || isSubmitting}
										>
											{isSubmitting ? (
												<Tx label={"Please wait..."} />
											) : (
												<Tx label={"Change password (title)"} />
											)}
										</form.SubmitButton>

										<ErrorBadge
											placeholder
											error={mutation.error}
										/>
									</>
								);
							}}
						</form.Subscribe>
					</Container>
				</form>
			</Container>
		</BottomSheet>
	);
};
