import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	Button,
	Container,
	FormField,
	LinkTo,
	SnapperNav,
	Status,
	Tx,
	UserIcon,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import { useRef } from "react";
import { z } from "zod";
import { authClient } from "~/app/auth/authClient";
import { withEmailSignInMutation } from "~/app/auth/withEmailSignInMutation";
import { useAppForm } from "~/app/form/useAppForm";
import { Sheet } from "~/app/sheet/Sheet";
import { Fade } from "~/app/ui/fade/Fade";
import { PassKeyIcon } from "~/app/ui/icon/PassKeyIcon";
import { SocialIcon } from "~/app/ui/icon/SocialIcon";
import { UnlockIcon } from "~/app/ui/icon/UnlockIcon";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";
import { ThemeCls } from "~/app/ui/ThemeCls";

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
			async onSuccess() {
				return navigate({
					to: "/$locale/app/dashboard",
					params: {
						locale,
					},
				});
			},
		});

		const passkeyMutation = useMutation({
			async mutationFn() {
				return authClient.signIn.passkey();
			},
			async onSuccess() {
				await navigate({
					to: "/$locale/app/dashboard",
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

		return (
			<Container position={"relative"}>
				<SnapperNav
					containerRef={rootRef}
					iconProps={() => ({
						size: "xs",
						tone: "secondary",
						theme: "light",
					})}
					pages={{
						count: 3,
					}}
					orientation={"vertical"}
					subtle
				/>

				<PrimaryOverlay />

				<Fade scrollableRef={rootRef} />

				<Container
					ref={rootRef}
					layout={"vertical-full"}
					overflow={"vertical"}
					snap={"vertical-start"}
					gap={"md"}
				>
					<Sheet>
						<Container square={"xl"}>
							<VariantProvider
								cls={ThemeCls}
								variant={{
									tone: "primary",
									theme: "light",
								}}
							>
								<Status
									icon={UserIcon}
									textTitle={"Sign in"}
									textMessage={"Register (link)"}
								>
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
								</Status>

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

									<div
										className={
											"inline-flex items-center justify-center gap-4 w-full"
										}
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
									</div>
								</form>
							</VariantProvider>
						</Container>
					</Sheet>

					<Sheet>
						<Status
							icon={PassKeyIcon}
							textTitle={"Login with passkey (title)"}
							textMessage={"Login with passkey (message)"}
						>
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
						</Status>
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
