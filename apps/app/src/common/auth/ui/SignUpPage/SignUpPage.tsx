import { useNavigate } from "@tanstack/react-router";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { type FC, useRef } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { FormField, onSubmit } from "@/lib/client/form";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { withRegisterMutation } from "~/common/auth/mutation/withRegisterMutation";
import { useAppForm } from "~/common/ui/form";
import { CheckIcon } from "~/common/ui/icon";
import { Logo } from "~/common/ui/logo";

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

export const SignUpPage: FC<SignUpPage.Props> = ({ ui, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();

	const registerMutation = withRegisterMutation.useMutation({
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
			onSubmit: RegisterSchema,
		},
		onSubmit: onSubmit({
			mutation: registerMutation,
		}),
	});

	const scrollerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui="SignUpPage[Container]"
			ui={{
				layout: "vertical-centered",
				position: "relative",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
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
									{(fieldProps) => (
										<field.TextInput
											type={"email"}
											autoComplete={"email"}
											placeholder={translator.text("Enter your email")}
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											{...fieldProps}
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
											type={"password"}
											autoComplete={"new-password"}
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

						<form.AppField name={"confirmPassword"}>
							{(field) => (
								<FormField
									id={field.name}
									name={field.name}
									label={<Tx label={"Confirm Password"} />}
									meta={field.state.meta}
								>
									{(fieldProps) => (
										<field.TextInput
											type={"password"}
											autoComplete={"new-password"}
											value={field.state.value ?? ""}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											placeholder={translator.text("Confirm your password")}
											{...fieldProps}
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
							<form.Subscribe
								selector={(state) => ({
									isValid: state.isValid,
									isSubmitting: state.isSubmitting,
								})}
							>
								{({ isValid, isSubmitting }) => (
									<form.SubmitButton
										iconEnabled={"icon-[eos-icons--system-re-registered]"}
										disabled={!isValid || isSubmitting}
									>
										{isSubmitting ? (
											<Tx label={"Please wait..."} />
										) : (
											<Tx label={"Register"} />
										)}
									</form.SubmitButton>
								)}
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
};
