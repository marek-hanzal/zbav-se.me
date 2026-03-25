import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { FormField } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import { PassKeyIcon, UnlockIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { useRef } from "react";
import { z } from "zod";
import { authClient } from "~/client/@common/auth/authClient";
import { withEmailSignInMutation } from "~/client/@common/auth/mutation/withEmailSignInMutation";

const SignInSchema = z.object({
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
});

type SignInSchema = typeof SignInSchema;

export const Route = createFileRoute("/$locale/sign-in")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
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

		const passkeyMutation = useMutation({
			async mutationFn() {
				await authClient.signIn.passkey();
				await navigate({
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
				onSubmit: SignInSchema,
			},
			async onSubmit({ value }) {
				return signInMutation.mutateAsync({
					email: value.email,
					password: value.password,
				});
			},
		});

		const rootRef = useRef<HTMLDivElement>(null);

		return (
			<Container
				data-ui="/login[Container]"
				ui={{
					position: "relative",
					height: "full",
				}}
			>
				<Fade scrollableRef={rootRef} />

				<Container
					data-ui="/login-[Container.scrollable]"
					ref={rootRef}
					ui={{
						layout: "vertical-full",
						gap: "default",
						snap: "vertical",
						snapAlign: "center",
						height: "full",
					}}
				>
					<Container
						data-ui="/login-[Container.content]"
						ui={{
							layout: "vertical-centered",
							height: "full",
							width: "full",
						}}
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
							ui={{
								width: "full",
								inner: "xl",
							}}
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
													type={"email"}
													autoComplete={"email webauthn"}
													placeholder={translator.text(
														"Enter your email",
													)}
													value={field.state.value ?? ""}
													onBlur={field.handleBlur}
													onChange={(e) =>
														field.handleChange(e.target.value)
													}
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
													autoComplete={"current-password webauthn"}
													value={field.state.value ?? ""}
													onChange={(e) =>
														field.handleChange(e.target.value)
													}
													onBlur={field.handleBlur}
													placeholder={translator.text(
														"Enter your password",
													)}
													{...props}
												/>
											)}
										</FormField>
									)}
								</form.AppField>

								{signInMutation.isError && (
									<div className={"rounded-md bg-red-50 p-3 text-red-700"}>
										{signInMutation.error instanceof Error ? (
											signInMutation.error.message
										) : (
											<Tx label={"Login failed"} />
										)}
									</div>
								)}

								<Container
									ui={{
										layout: "vertical-flex",
										width: "full",
										items: "end",
										gap: "lg",
									}}
								>
									<form.SubmitButton
										iconEnabled={ChevronRightIcon}
										iconPosition={"right"}
										disabled={signInMutation.isPending}
									>
										{signInMutation.isPending ? (
											<Tx label={"Please wait..."} />
										) : (
											<Tx label={"Sign in (button)"} />
										)}
									</form.SubmitButton>

									<LinkTo
										to={"/$locale/sign-up"}
										params={{
											locale,
										}}
									>
										<Tx
											label={"Register (link)"}
											ui={{
												tone: "link",
												theme: "light",
												text: "md",
												color: "lead",
											}}
										/>
									</LinkTo>
								</Container>
							</form>
						</Status>
					</Container>

					<Container
						ui={{
							layout: "vertical-centered",
							height: "full",
						}}
					>
						<Status
							icon={PassKeyIcon}
							textTitle={translator.text("Login with passkey (title)")}
							textMessage={translator.text("Login with passkey (message)")}
							action={
								<Button
									iconEnabled={UnlockIcon}
									iconProps={{
										ui: {
											text: "2xl",
										},
									}}
									onClick={() => {
										passkeyMutation.mutate();
									}}
									disabled={passkeyMutation.isPending}
									ui={{
										size: "xl",
										tone: "primary",
										theme: "light",
										text: "lg",
									}}
								>
									<Tx label={"Login with passkey"} />
								</Button>
							}
							ui={{
								inner: "4xl",
							}}
							className={"text-center"}
						/>
					</Container>
				</Container>
			</Container>
		);
	},
});
