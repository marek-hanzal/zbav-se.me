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
import { useId, useRef } from "react";
import { authClient } from "~/app/auth/authClient";
import { withEmailSignInMutation } from "~/app/auth/withEmailSignInMutation";
import { useAppForm } from "~/app/form/useAppForm";
import { Sheet } from "~/app/sheet/Sheet";
import { Fade } from "~/app/ui/fade/Fade";
import { PassKeyIcon } from "~/app/ui/icon/PassKeyIcon";
import { SocialIcon } from "~/app/ui/icon/SocialIcon";
import { UnlockIcon } from "~/app/ui/icon/UnlockIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const Route = createFileRoute("/$locale/login")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
		const navigate = useNavigate();

		const signInMutation = withEmailSignInMutation.useMutation({
			onSuccess: () => {
				navigate({
					to: "/$locale/n/feed",
					params: {
						locale,
					},
				});
			},
		});

		const passkeyMutation = useMutation({
			mutationFn: async () => {
				return authClient.signIn.passkey();
			},
			onSuccess() {
				navigate({
					to: "/$locale/n/feed",
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
			},
			async onSubmit({ value }) {
				signInMutation.mutate({
					email: value.email,
					password: value.password,
				});
			},
		});

		const rootRef = useRef<HTMLDivElement>(null);
		const emailNavId = useId();
		const passKeyNavId = useId();
		const socialNavId = useId();

		return (
			<Container position={"relative"}>
				<SnapperNav
					containerRef={rootRef}
					iconProps={() => ({
						size: "sm",
					})}
					pages={[
						{
							id: emailNavId,
							icon: "icon-[line-md--email]",
						},
						{
							id: passKeyNavId,
							icon: PassKeyIcon,
						},
						{
							id: socialNavId,
							icon: SocialIcon,
						},
					]}
					orientation={"vertical"}
				/>

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
							<Status
								icon={UserIcon}
								textTitle={<Tx label={"Sign in"} />}
								textMessage={
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
								}
								tone={"secondary"}
								theme={"light"}
							/>

							<VariantProvider
								cls={ThemeCls}
								variant={{
									tone: "secondary",
									theme: "light",
								}}
							>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										e.stopPropagation();
										form.handleSubmit();
									}}
									className={"space-y-4"}
								>
									<form.AppField
										name={"email"}
										validators={{
											onBlur({ value }) {
												if (!value) {
													return {
														message:
															translator.text(
																"Email is required",
															),
													};
												}
												if (
													!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
														value,
													)
												) {
													return {
														message:
															translator.text(
																"Invalid email address",
															),
													};
												}
												return undefined;
											},
										}}
									>
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

									<form.AppField
										name={"password"}
										validators={{
											onChange: ({ value }) => {
												if (!value) {
													return {
														message:
															translator.text(
																"Password is required",
															),
													};
												}
												return undefined;
											},
										}}
									>
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
											disabled={signInMutation.isPending}
											tone={"secondary"}
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
							textTitle={
								<Tx label={"Login with passkey (title)"} />
							}
							textMessage={
								<Tx label={"Login with passkey (message)"} />
							}
							tone={"secondary"}
							theme={"light"}
						>
							<Button
								iconEnabled={UnlockIcon}
								iconDisabled={UnlockIcon}
								onClick={() => {
									passkeyMutation.mutate();
								}}
								disabled={passkeyMutation.isPending}
								size={"lg"}
								tone={"secondary"}
								theme={"dark"}
							>
								<Tx label={"Login with passkey"} />
							</Button>
						</Status>
					</Sheet>

					<Sheet>
						<Status
							icon={SocialIcon}
							textTitle={
								<Tx label={"Login with social (title)"} />
							}
							textMessage={
								<Tx label={"Login with social (message)"} />
							}
							tone={"secondary"}
							theme={"light"}
						/>
					</Sheet>
				</Container>
			</Container>
		);
	},
});
