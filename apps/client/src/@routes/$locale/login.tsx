import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	Container,
	FormField,
	LinkTo,
	Status,
	Tx,
	UserIcon,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import { authClient } from "~/app/auth/authClient";
import { withEmailSignInMutation } from "~/app/auth/withEmailSignInMutation";
import { useAppForm } from "~/app/form/useAppForm";
import { Sheet } from "~/app/sheet/Sheet";
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

		<Button
			iconEnabled={"icon-[hugeicons--shield-key]"}
			iconDisabled={"icon-[hugeicons--shield-key]"}
			onClick={() => {
				passkeyMutation.mutate();
			}}
		>
			<Tx label={"Login with passkey"} />
		</Button>;

		return (
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
									onChange: ({ value }) => {
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
												message: translator.text(
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
										required
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
												message: translator.text(
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
										label={<Tx label={"Password"} />}
										meta={field.state.meta}
										required
									>
										{(props) => (
											<field.TextInput
												type={"password"}
												autoComplete={
													"current-password webauthn"
												}
												value={field.state.value ?? ""}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
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
								<div
									className={
										"rounded-md bg-red-50 p-3 text-red-700"
									}
								>
									{signInMutation.error instanceof Error ? (
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
									iconEnabled={"icon-[si--unlock-line]"}
									iconDisabled={"icon-[si--unlock-line]"}
									disabled={signInMutation.isPending}
									tone={"secondary"}
									theme={"dark"}
									size={"lg"}
								>
									{signInMutation.isPending ? (
										<Tx label={"Please wait..."} />
									) : (
										<Tx label={"Sign in (button)"} />
									)}
								</form.SubmitButton>
							</div>
						</form>
					</VariantProvider>
				</Container>
			</Sheet>
		);
	},
});
