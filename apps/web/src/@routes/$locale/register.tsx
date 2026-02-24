import { createFileRoute, useParams } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { FormField, onSubmit } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { linkTo } from "@use-pico/common/link-to";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { useRef } from "react";
import { z } from "zod";
import { withRegisterMutation } from "~/app/auth/withRegisterMutation";

const RegisterSchema = z
	.object({
		email: z.email({
			error() {
				return translator.text("Invalid email address");
			},
		}),
		password: z.string().min(8, {
			error() {
				return translator.text("Password must be at least 8 characters");
			},
		}),
		confirmPassword: z.string().min(1, {
			error() {
				return translator.text("Password confirmation is required");
			},
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: translator.text("Passwords do not match"),
		path: [
			"confirmPassword",
		],
	});

type RegisterSchema = typeof RegisterSchema;

export const Route = createFileRoute("/$locale/register")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
		const navigate = Route.useNavigate();

		const registerMutation = withRegisterMutation.useMutation({
			async onPostMutation() {
				return navigate({
					href: linkTo({
						base: import.meta.env.VITE_APP_ORIGIN,
						href: "/:locale/welcome",
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
				confirmPassword: "",
			} satisfies z.infer<RegisterSchema>,
			validators: {
				onSubmit: RegisterSchema,
			},
			onSubmit: onSubmit({
				mutation: registerMutation,
			}),
		});

		const scrollerRef = useRef<HTMLDivElement>(null);

		return (
			<Container
				data-ui="/register[Container]"
				ui={{
					layout: "vertical-centered",
					position: "relative",
					height: "full",
					width: "full",
				}}
			>
				<Fade scrollableRef={scrollerRef} />

				<Container
					ref={scrollerRef}
					ui={{
						layout: "vertical-flex",
						scroll: "vertical",
						width: "full",
						height: "full",
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
						textTitle={translator.text("Register (title)")}
						ui={{
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
												autoComplete={"email"}
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
												type={"password"}
												autoComplete={"new-password"}
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

							<form.AppField name={"confirmPassword"}>
								{(field) => (
									<FormField
										id={field.name}
										name={field.name}
										label={<Tx label={"Confirm Password"} />}
										meta={field.state.meta}
									>
										{(props) => (
											<field.TextInput
												type={"password"}
												autoComplete={"new-password"}
												value={field.state.value ?? ""}
												onChange={(e) => field.handleChange(e.target.value)}
												onBlur={field.handleBlur}
												placeholder={translator.text(
													"Confirm your password",
												)}
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>

							<Container
								ui={{
									layout: "vertical-flex",
									width: "full",
									items: "end",
									gap: "lg",
								}}
							>
								<form.SubmitButton
									iconEnabled={"icon-[eos-icons--system-re-registered]"}
									disabled={registerMutation.isPending}
								>
									{registerMutation.isPending ? (
										<Tx label={"Please wait..."} />
									) : (
										<Tx label={"Register"} />
									)}
								</form.SubmitButton>

								<LinkTo
									to={"/$locale/login"}
									params={{
										locale,
									}}
								>
									<Tx
										label={"Login (link)"}
										ui={{
											tone: "link",
											theme: "light",
											text: "md",
											color: "lead",
										}}
									/>
								</LinkTo>
							</Container>

							<div className={"flex flex-col gap-2 w-full"}>
								<Tx
									label={"Agreement with (label)"}
									ui={{
										text: "sm",
										font: "bold",
									}}
								/>

								<LinkTo
									icon={CheckIcon}
									to={"/$locale/tos"}
									params={{
										locale,
									}}
								>
									<Tx
										label={"ToS agreement (label)"}
										ui={{
											tone: "link",
											text: "lg",
										}}
									/>
								</LinkTo>

								<LinkTo
									icon={CheckIcon}
									to={"/$locale/privacy"}
									params={{
										locale,
									}}
								>
									<Tx
										label={"Privacy policy (label)"}
										ui={{
											tone: "link",
											text: "lg",
										}}
									/>
								</LinkTo>
							</div>
						</form>
					</Status>
				</Container>
			</Container>
		);
	},
});
