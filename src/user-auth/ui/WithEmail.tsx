import { useNavigate, useRouter } from "@tanstack/react-router";
import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { Logo } from "~/application-ui/ui/logo.exports";
import { onSubmitFn } from "~/form/fn/onSubmitFn";
import { FormField } from "~/form/ui/FormField";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { Container } from "~/ui/ui/Container";
import { ErrorBadge } from "~/ui/ui/ErrorBadge";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Status } from "~/ui/ui/Status";
import { withEmailSignInMutation } from "~/user-auth/mutation/withEmailSignInMutation";

const useFormSchema = () => {
	const translator = useTranslator();

	return z
		.looseObject({
			email: z.email({
				error() {
					return translator.textFn("Invalid email address");
				},
			}),
			password: z.string().min(1, {
				error() {
					return translator.textFn("Password is required");
				},
			}),
		})
		.strip();
};

type FormSchema = ReturnType<typeof useFormSchema>;

export namespace WithEmail {
	export interface Props extends Container.Props {
		target?: string;
	}
}

export const WithEmail: FC<WithEmail.Props> = ({ target, ...props }) => {
	const locale = useLocale();
	const navigateFn = useNavigate();
	const router = useRouter();
	const translator = useTranslator();
	const schema = useFormSchema();

	const signInMutation = withEmailSignInMutation.useMutation({
		async onPostMutationFn() {
			const fallback = router.buildLocation({
				to: "/$locale/app/home",
				params: {
					locale,
				},
			});

			return navigateFn({
				href: target ?? fallback.href,
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies z.infer<FormSchema>,
		validators: {
			onSubmit: schema,
		},
		onSubmit: onSubmitFn({
			mutation: signInMutation,
		}),
	});

	return (
		<Container
			data-ui={"WithEmail[Container]"}
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
										data-ui={"SignIn-[EmailInput]"}
										type={"email"}
										autoComplete={"email webauthn"}
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
								{(fieldProps) => (
									<field.TextInput
										data-ui={"SignIn-[PasswordInput]"}
										type={"password"}
										autoComplete={"current-password webauthn"}
										value={field.state.value ?? ""}
										onChange={(e) => field.handleChange(e.target.value)}
										onBlur={field.handleBlur}
										placeholder={translator.textFn("Enter your password")}
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
										data-ui={"SignIn-[SubmitButton]"}
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
