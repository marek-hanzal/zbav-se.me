import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ErrorBadge } from "@/lib/client/error";
import { FormField } from "@/lib/client/form";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { onSubmit } from "@/lib/client/submit";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { useAppForm } from "~/common/ui/form";
import { Logo } from "~/common/ui/logo";
import { withResetPasswordMutation } from "~/user/auth/mutation/withResetPasswordMutation";

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

export namespace ResetPasswordPage {
	export interface Props extends Container.Props {
		resetError?: string;
		token?: string;
	}
}

export const ResetPasswordPage: FC<ResetPasswordPage.Props> = ({ resetError, token, ...props }) => {
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
					token: token ?? "",
				};
			},
			mutation,
		}),
	});

	const invalidTokenMessage =
		resetError === "INVALID_TOKEN" || !token
			? translator.text("This reset link is invalid or expired")
			: undefined;

	return (
		<Container
			data-ui="ResetPasswordPage"
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
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
											data-ui={"ResetPasswordPage[PasswordInput]"}
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
											data-ui={"ResetPasswordPage[ConfirmPasswordInput]"}
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
											data-ui={"ResetPasswordPage[SubmitButton]"}
											iconEnabled={ChevronRightIcon}
											iconPosition={"right"}
											disabled={!token || !isValid || isSubmitting}
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
};
