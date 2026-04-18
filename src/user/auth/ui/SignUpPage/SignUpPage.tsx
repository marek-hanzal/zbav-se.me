import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ErrorBadge } from "@/lib/client/error";
import { FormField } from "@/lib/client/form";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { onSubmit } from "@/lib/client/submit";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { useAppForm } from "~/common/ui/form";
import { CheckIcon } from "~/common/ui/icon";
import { Logo } from "~/common/ui/logo";
import { withRegisterMutation } from "~/user/auth/mutation/withRegisterMutation";

const RegisterSchema = z
	.looseObject({
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
	})
	.strip();

type RegisterSchema = typeof RegisterSchema;

export namespace SignUpPage {
	export interface Props extends Container.Props {
		//
	}
}

export const SignUpPage: FC<SignUpPage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();

	const mutation = withRegisterMutation.useMutation({
		async onPostMutation() {
			return navigate({
				to: "/$locale/app/welcome",
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
			confirmPassword: "",
		} satisfies z.infer<RegisterSchema>,
		validators: {
			onMount: RegisterSchema,
			onSubmit: RegisterSchema,
		},
		onSubmit: onSubmit({
			mutation,
		}),
	});

	return (
		<Container
			data-ui="SignUpPage"
			ui={{
				layout: "vertical-centered",
				position: "relative",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Container
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
						inner: "default",
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
											data-ui={"SignUpPage[EmailInput]"}
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
											data-ui={"SignUpPage[PasswordInput]"}
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
											data-ui={"SignUpPage[ConfirmPasswordInput]"}
											type={"password"}
											autoComplete={"new-password"}
											value={field.state.value ?? ""}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder={translator.text("Confirm your password")}
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
								items: "center",
								gap: "default",
							}}
						>
							<form.Subscribe
								selector={(state) => ({
									isValid: state.isValid,
									isSubmitting: state.isSubmitting,
								})}
							>
								{({ isValid, isSubmitting }) => {
									return (
										<>
											<form.SubmitButton
												data-action={"sign up"}
												data-ui={"SignUpPage[SubmitButton]"}
												iconEnabled={"icon-[solar--user-hand-up-linear]"}
												disabled={!isValid || isSubmitting}
											>
												{isSubmitting ? (
													<Tx label={"Please wait..."} />
												) : (
													<Tx label={"Register"} />
												)}
											</form.SubmitButton>

											<ErrorBadge
												placeholder
												error={mutation.error}
											/>
										</>
									);
								}}
							</form.Subscribe>

							<LinkTo
								to={"/$locale/sign-in"}
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

						<div className={"flex flex-col gap-1 w-full"}>
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
								iconProps={{
									ui: {
										text: "xl",
									},
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
								iconProps={{
									ui: {
										text: "xl",
									},
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
};
