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
import { withEmailSignInMutation } from "../../mutation/withEmailSignInMutation";

const useSignInSchema = () => {
	const translator = useTranslator();

	return z
		.looseObject({
			email: z.email({
				error() {
					return translator.text("Invalid email address");
				},
			}),
			password: z.string().min(1, {
				error() {
					return translator.text("Password is required");
				},
			}),
		})
		.strip();
};

type SignInSchema = ReturnType<typeof useSignInSchema>;

export namespace WithEmail {
	export interface Props extends Container.Props {
		//
	}
}

export const WithEmail: FC<WithEmail.Props> = ({ ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const navigate = useNavigate();
	const schema = useSignInSchema();

	const signInMutation = withEmailSignInMutation.useMutation({
		async onPostMutation() {
			return navigate({
				to: "/$locale/app/home",
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
		} satisfies z.infer<SignInSchema>,
		validators: {
			onMount: schema,
			onSubmit: schema,
		},
		onSubmit: onSubmit({
			mutation: signInMutation,
		}),
	});

	return (
		<Container
			data-ui={"WithEmail"}
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
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
				data-ui-width="full"
				data-ui-inner="xl"
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						void form.handleSubmit();
					}}
					className={"space-y-2"}
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
										data-ui={"SignInPage[EmailInput]"}
										type={"email"}
										autoComplete={"email webauthn"}
										autoFocus
										placeholder={translator.text("Enter your email")}
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
								{(fieldProps) => (
									<field.TextInput
										data-ui={"SignInPage[PasswordInput]"}
										type={"password"}
										autoComplete={"current-password webauthn"}
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder={translator.text("Enter your password")}
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
										data-action={"sign in"}
										data-ui={"SignInPage[SubmitButton]"}
										iconEnabled={ChevronRightIcon}
										iconPosition={"right"}
										disabled={!isValid || isSubmitting}
									>
										{signInMutation.isPending ? (
											<Tx label={"Please wait..."} />
										) : (
											<Tx label={"Sign in (button)"} />
										)}
									</form.SubmitButton>

									<ErrorBadge
										placeholder
										error={signInMutation.error}
									/>
								</>
							)}
						</form.Subscribe>

						<LinkTo
							to={"/$locale/forgot/password"}
							params={{
								locale,
							}}
						>
							<Tx
								label={"Forgot password? (link)"}
								data-ui-tone="link"
								data-ui-theme="light"
								data-ui-text="md"
								data-ui-color="lead"
							/>
						</LinkTo>

						<LinkTo
							to={"/$locale/sign-up"}
							params={{
								locale,
							}}
						>
							<Tx
								label={"Register (link)"}
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
	);
};
