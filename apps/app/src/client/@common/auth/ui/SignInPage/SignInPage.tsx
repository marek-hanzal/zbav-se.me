import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { FormField, onSubmit } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import { Logo } from "@zbav-se.me/ui/logo";
import { type FC, useRef } from "react";
import { z } from "zod";
import { withEmailSignInMutation } from "~/client/@common/auth/mutation/withEmailSignInMutation";

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

export const SignInPage: FC<SignInPage.Props> = ({ ui, ...props }) => {
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
			data-ui="SignInPage[Container]"
			ui={{
				position: "relative",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Fade scrollableRef={rootRef} />

			<Container
				data-ui="SignInPage-[Container.scrollable]"
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
					data-ui="SignInPage-[Container.content]"
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
										{(fieldProps) => (
											<field.TextInput
												type={"email"}
												autoComplete={"email webauthn"}
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
												autoComplete={"current-password webauthn"}
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
								<form.Subscribe
									selector={(store) => ({
										isValid: store.isValid,
										isSubmitting: store.isSubmitting,
									})}
								>
									{({ isValid, isSubmitting }) => (
										<form.SubmitButton
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
			</Container>
		</Container>
	);
};
