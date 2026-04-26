import { useNavigate } from "@tanstack/react-router";
import { type FC, useRef } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ErrorBadge } from "@/lib/client/error";
import { Fade } from "@/lib/client/fade";
import { FormField } from "@/lib/client/form";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { onSubmit } from "@/lib/client/submit";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { useAppForm } from "~/common/ui/form";
import { Logo } from "~/common/ui/logo";
import { withEmailSignInMutation } from "~/user/auth/mutation/withEmailSignInMutation";

const SignInSchema = z
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

type SignInSchema = typeof SignInSchema;

export namespace SignInPage {
	export interface Props extends Container.Props {
		//
	}
}

export const SignInPage: FC<SignInPage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();

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
			onMount: SignInSchema,
			onSubmit: SignInSchema,
		},
		onSubmit: onSubmit({
			mutation: signInMutation,
		}),
	});

	const rootRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui="SignInPage"
			data-ui-position="relative"
			data-ui-height="full"
			{...props}
		>
			<Fade scrollableRef={rootRef} />

			<Container
				data-ui="SignInPage-[Container.scrollable]"
				ref={rootRef}
				data-ui-layout="vertical-full"
				data-ui-gap="default"
				data-ui-snap="vertical"
				data-ui-snap-align="center"
				data-ui-height="full"
			>
				<Container
					data-ui="SignInPage-[Container.content]"
					data-ui-layout="vertical-centered"
					data-ui-height="full"
					data-ui-width="full"
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
								form.handleSubmit();
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
										{(props) => (
											<field.TextInput
												data-ui={"SignInPage[PasswordInput]"}
												type={"password"}
												autoComplete={"current-password webauthn"}
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
			</Container>
		</Container>
	);
};
