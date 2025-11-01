import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { useSnapperNav } from "@use-pico/client/hook";
import { UserIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { SnapperNav } from "@use-pico/client/ui/snapper-nav";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { VariantProvider } from "@use-pico/cls";
import { linkTo, translator } from "@use-pico/common";
import {
	Fade,
	PassKeyIcon,
	PrimaryOverlay,
	Sheet,
	SocialIcon,
	ThemeCls,
	UnlockIcon,
} from "@zbav-se.me/ui";
import { useRef } from "react";
import { z } from "zod";
import { authClient } from "~/app/auth/authClient";
import { withEmailSignInMutation } from "~/app/auth/withEmailSignInMutation";
import { useAppForm } from "~/app/form/useAppForm";

const LoginSchema = z.object({
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

type LoginSchema = typeof LoginSchema;

export const Route = createFileRoute("/$locale/login")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
		const navigate = useNavigate();

		const signInMutation = withEmailSignInMutation.useMutation({
			async onPostMutation() {
				return navigate({
					href: linkTo({
						base: import.meta.env.VITE_APP_ORIGIN,
						href: "/:locale/dashboard",
						query: {
							locale,
						},
					}),
				});
			},
		});

		const passkeyMutation = useMutation({
			async mutationFn() {
				await authClient.signIn.passkey();
				await navigate({
					href: linkTo({
						base: import.meta.env.VITE_APP_ORIGIN,
						href: "/:locale/dashboard",
						query: {
							locale,
						},
					}),
				});
			},
		});

		const form = useAppForm({
			defaultValues: {
				email: "",
				password: "",
			} satisfies z.infer<LoginSchema>,
			validators: {
				onSubmit: LoginSchema,
			},
			async onSubmit({ value }) {
				return signInMutation.mutateAsync({
					email: value.email,
					password: value.password,
				});
			},
		});

		const rootRef = useRef<HTMLDivElement>(null);
		const snapperNav = useSnapperNav({
			containerRef: rootRef,
			orientation: "vertical",
			count: 3,
		});

		return (
			<Container
				position={"relative"}
				tone={"secondary"}
				theme={"light"}
			>
				<SnapperNav
					snapperNav={snapperNav}
					iconProps={() => ({
						size: "xs",
						tone: "secondary",
						theme: "light",
					})}
					orientation={"vertical"}
					subtle
				/>

				<PrimaryOverlay />

				<Fade scrollableRef={rootRef} />

				<Container
					ref={rootRef}
					layout={"vertical-full"}
					snap={"vertical-center"}
					gap={"md"}
					square={"md"}
					round={"lg"}
				>
					<Sheet>
						<VariantProvider
							cls={ThemeCls}
							variant={{
								tone: "primary",
								theme: "light",
							}}
						>
							<Status
								icon={UserIcon}
								textTitle={"Sign in (title)"}
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
														autoComplete={
															"email webauthn"
														}
														placeholder={translator.text(
															"Enter your email",
														)}
														value={
															field.state.value ??
															""
														}
														onBlur={
															field.handleBlur
														}
														onChange={(e) =>
															field.handleChange(
																e.target.value,
															)
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
												label={
													<Tx label={"Password"} />
												}
												meta={field.state.meta}
											>
												{(props) => (
													<field.TextInput
														type={"password"}
														autoComplete={
															"current-password webauthn"
														}
														value={
															field.state.value ??
															""
														}
														onChange={(e) =>
															field.handleChange(
																e.target.value,
															)
														}
														onBlur={
															field.handleBlur
														}
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
										<div
											className={
												"rounded-md bg-red-50 p-3 text-red-700"
											}
										>
											{signInMutation.error instanceof
											Error ? (
												signInMutation.error.message
											) : (
												<Tx label={"Login failed"} />
											)}
										</div>
									)}

									<Container
										layout={"vertical-flex"}
										items={"center"}
										gap={"sm"}
										width={"fit"}
									>
										<form.SubmitButton
											iconEnabled={UnlockIcon}
											iconDisabled={UnlockIcon}
											iconProps={{
												size: "sm",
											}}
											disabled={signInMutation.isPending}
											tone={"primary"}
											theme={"dark"}
											size={"lg"}
										>
											{signInMutation.isPending ? (
												<Tx label={"Please wait..."} />
											) : (
												<Tx
													label={"Sign in (button)"}
												/>
											)}
										</form.SubmitButton>

										<LinkTo
											to={"/$locale/register"}
											params={{
												locale,
											}}
										>
											<Tx
												label={"Register (link)"}
												tone={"link"}
											/>
										</LinkTo>
									</Container>
								</form>
							</Status>
						</VariantProvider>
					</Sheet>

					<Sheet>
						<Status
							icon={PassKeyIcon}
							textTitle={"Login with passkey (title)"}
							textMessage={"Login with passkey (message)"}
							action={
								<Button
									iconEnabled={UnlockIcon}
									iconDisabled={UnlockIcon}
									iconProps={{
										size: "sm",
									}}
									onClick={() => {
										passkeyMutation.mutate();
									}}
									disabled={passkeyMutation.isPending}
									size={"lg"}
									tone={"primary"}
									theme={"dark"}
									label={"Login with passkey"}
								/>
							}
						/>
					</Sheet>

					<Sheet>
						<Status
							icon={SocialIcon}
							textTitle={"Login with social (title)"}
							textMessage={"Login with social (message)"}
							tone={"primary"}
							theme={"light"}
						/>
					</Sheet>
				</Container>
			</Container>
		);
	},
});
