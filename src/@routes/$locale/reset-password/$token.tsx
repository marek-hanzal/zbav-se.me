import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { Logo } from "~/application-ui/ui/logo.exports";
import { onSubmit } from "~/form/fn/onSubmit";
import { FormField } from "~/form/ui/FormField";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { Container } from "~/ui/ui/Container";
import { ErrorBadge } from "~/ui/ui/ErrorBadge";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Status } from "~/ui/ui/Status";
import { withResetPasswordMutation } from "~/user-auth/mutation/withResetPasswordMutation";

const ResetPasswordSearchSchema = z
	.looseObject({
		error: z.string().optional(),
	})
	.strip();

export const Route = createFileRoute("/$locale/reset-password/$token")({
	validateSearch: ResetPasswordSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { error } = Route.useSearch();
	const { token } = Route.useParams();

	const resetError = error;

	const translator = useTranslator();
	const locale = useLocale();
	const navigate = useNavigate();
	const schema = useResetPasswordSchema();

	const mutation = withResetPasswordMutation.useMutation({
		async onPostMutation() {
			return navigate({
				params: {
					locale,
				},
				to: "/$locale/sign-in",
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			confirmPassword: "",
			password: "",
		} satisfies z.infer<ResetPasswordSchema>,
		validators: {
			onMount: schema,
			onSubmit: schema,
		},
		onSubmit: onSubmit({
			map: async ({ values }) => {
				return {
					newPassword: values.password,
					token,
				};
			},
			mutation,
		}),
	});

	const invalidTokenMessage =
		resetError === "INVALID_TOKEN"
			? translator.text("This reset link is invalid or expired")
			: undefined;

	return (
		<Container
			data-ui="ResetPassword[Container]"
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
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
					textTitle={"Choose a new password"}
					data-ui-inner="default"
				>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							void form.handleSubmit();
						}}
						className={"space-y-2"}
					>
						{invalidTokenMessage && (
							<Container data-ui-width="full">
								<Tx
									label={invalidTokenMessage}
									data-ui-display="block"
									data-ui-align="center"
									data-ui-tone="danger"
								/>
							</Container>
						)}

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
											data-ui={"ResetPassword-[PasswordInput]"}
											type={"password"}
											autoComplete={"new-password"}
											autoFocus
											placeholder={translator.text("Enter your new password")}
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
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
									{(fieldProps) => (
										<field.TextInput
											data-ui={"ResetPassword-[ConfirmPasswordInput]"}
											type={"password"}
											autoComplete={"new-password"}
											placeholder={translator.text(
												"Confirm your new password",
											)}
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											{...fieldProps}
										/>
									)}
								</FormField>
							)}
						</form.AppField>

						<Container
							data-ui-layout="vertical-flex"
							data-ui-width="full"
							data-ui-items="center"
							data-ui-gap="lg"
						>
							<form.Subscribe
								selector={(store) => ({
									isValid: store.isValid,
									isSubmitting: store.isSubmitting,
								})}
							>
								{({ isValid, isSubmitting }) => (
									<>
										<form.SubmitButton
											data-action={"reset password"}
											data-ui={"ResetPassword-[SubmitButton]"}
											iconEnabled={ChevronRightIcon}
											iconPosition={"right"}
											disabled={!isValid || isSubmitting}
										>
											{mutation.isPending ? (
												<Tx label={"Please wait..."} />
											) : (
												<Tx label={"Reset password (button)"} />
											)}
										</form.SubmitButton>

										<ErrorBadge
											placeholder
											error={mutation.error}
										/>
									</>
								)}
							</form.Subscribe>

							<LinkTo
								to={"/$locale/sign-in"}
								params={{
									locale,
								}}
							>
								<Tx
									label={"Back to sign in"}
									data-ui-tone="link"
									data-ui-theme="light"
									data-ui-text="md"
									data-ui-color="lead"
								/>
							</LinkTo>
						</Container>
					</form>
				</Status>
			</Container>
		</Container>
	);
}

const useResetPasswordSchema = () => {
	const translator = useTranslator();

	return z
		.looseObject({
			confirmPassword: z.string().min(1, {
				error() {
					return translator.text("Password confirmation is required");
				},
			}),
			password: z.string().min(8, {
				error() {
					return translator.text("Password must be at least 8 characters");
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
type ResetPasswordSchema = ReturnType<typeof useResetPasswordSchema>;
