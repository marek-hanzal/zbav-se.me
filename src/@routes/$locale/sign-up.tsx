import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { CheckIcon } from "~/application-ui/constant/icon.exports";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { Logo } from "~/application-ui/ui/logo.exports";
import { onSubmitFn } from "~/form/fn/onSubmitFn";
import { FormField } from "~/form/ui/FormField";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { ErrorBadge } from "~/ui/ui/ErrorBadge";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Status } from "~/ui/ui/Status";
import { withRegisterMutation } from "~/user-auth/mutation/withRegisterMutation";

export const Route = createFileRoute("/$locale/sign-up")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();
		const navigateFn = useNavigate();
		const schema = useRegisterSchema();

		const mutation = withRegisterMutation.useMutation({
			async onPostMutationFn() {
				return navigateFn({
					to: "/$locale/app/welcome",
					params: {
						locale,
					},
				});
			},
		});

		const form = useAppForm({
			defaultValues: {
				email: "",
				password: "",
				confirmPassword: "",
			} satisfies z.infer<RegisterSchema>,
			validators: {
				onMount: schema,
				onSubmit: schema,
			},
			onSubmit: onSubmitFn({
				mutation,
			}),
		});

		return (
			<Container
				data-ui="SignUp[Container]"
				data-ui-layout="vertical-centered"
				data-ui-position="relative"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner={"default"}
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-scroll="vertical"
					data-ui-width="full"
					data-ui-height="content"
				>
					<Status
						icon={
							<LinkTo
								to={"/$locale/landing"}
								params={{
									locale,
								}}
							>
								<Logo />
							</LinkTo>
						}
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
							<form.AppField name={"email"}>
								{(field) => (
									<FormField
										id={field.name}
										name={field.name}
										label={<Tx label={"Email"} />}
										meta={field.state.meta}
									>
										{(props) => (
											<field.TextInput
												data-ui={"SignUp-[EmailInput]"}
												type={"email"}
												autoComplete={"email"}
												autoFocus
												placeholder={translator.textFn("Enter your email")}
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
												data-ui={"SignUp-[PasswordInput]"}
												type={"password"}
												autoComplete={"new-password"}
												value={field.state.value ?? ""}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												placeholder={translator.textFn(
													"Enter your password",
												)}
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
												data-ui={"SignUp-[ConfirmPasswordInput]"}
												type={"password"}
												autoComplete={"new-password"}
												value={field.state.value ?? ""}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												placeholder={translator.textFn(
													"Confirm your password",
												)}
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
													data-ui={"SignUp-[SubmitButton]"}
													iconEnabled={
														"icon-[solar--user-hand-up-linear]"
													}
													disabled={!isValid || isSubmitting}
												>
													{isSubmitting ? (
														<Tx label={"Please wait..."} />
													) : (
														<Tx label={"Register"} />
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

								<LinkTo
									to={"/$locale/sign-in"}
									params={{
										locale,
									}}
								>
									<Tx
										label={"Login (link)"}
										data-ui-tone="link"
										data-ui-theme="light"
										data-ui-text="md"
										data-ui-color="lead"
									/>
								</LinkTo>
							</Container>

							<div className={"flex flex-col gap-1 w-full"}>
								<Tx
									label={"Agreement with (label)"}
									data-ui-text="sm"
									data-ui-font="bold"
								/>

								<LinkTo
									icon={CheckIcon}
									to={"/$locale/tos"}
									params={{
										locale,
									}}
									iconProps={{
										"data-ui-text": "xl",
									}}
								>
									<Tx
										label={"ToS agreement (label)"}
										data-ui-tone="link"
										data-ui-text="lg"
									/>
								</LinkTo>

								<LinkTo
									icon={CheckIcon}
									to={"/$locale/privacy"}
									params={{
										locale,
									}}
									iconProps={{
										"data-ui-text": "xl",
									}}
								>
									<Tx
										label={"Privacy policy (label)"}
										data-ui-tone="link"
										data-ui-text="lg"
									/>
								</LinkTo>
							</div>
						</form>
					</Status>
				</Container>
			</Container>
		);
	},
});

const useRegisterSchema = () => {
	const translator = useTranslator();

	return z
		.looseObject({
			email: z.email({
				error() {
					return translator.textFn("Invalid email address");
				},
			}),
			password: z.string().min(8, {
				error() {
					return translator.textFn("Password must be at least 8 characters");
				},
			}),
			confirmPassword: z.string().min(1, {
				error() {
					return translator.textFn("Password confirmation is required");
				},
			}),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: translator.textFn("Passwords do not match"),
			path: [
				"confirmPassword",
			],
		})
		.strip();
};
type RegisterSchema = ReturnType<typeof useRegisterSchema>;
