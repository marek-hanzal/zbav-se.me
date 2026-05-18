import { useNavigate, useRouter } from "@tanstack/react-router";
import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ErrorBadge } from "@/lib/client/error";
import { FormField } from "@/lib/client/form";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { onSubmit } from "@/lib/client/submit";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { useAppForm } from "~/common/ui/form";
import { Logo } from "~/common/ui/logo";
import { withPasswordResetRequestMutation } from "~/user/auth/mutation/withPasswordResetRequestMutation";

const useFormSchema = () => {
	const translator = useTranslator();

	return z
		.looseObject({
			email: z.email({
				error() {
					return translator.text("Invalid email address");
				},
			}),
		})
		.strip();
};

type FormSchema = ReturnType<typeof useFormSchema>;

export namespace ForgotPasswordPage {
	export interface Props extends Container.Props {
		//
	}
}

export const ForgotPasswordPage: FC<ForgotPasswordPage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const router = useRouter();
	const translator = useTranslator();
	const schema = useFormSchema();

	const mutation = withPasswordResetRequestMutation.useMutation({
		async onPostMutation() {
			await navigate({
				to: "/$locale/forgot/sent",
				params: {
					locale,
				},
			});
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
		} satisfies z.infer<FormSchema>,
		validators: {
			onMount: schema,
			onSubmit: schema,
		},
		onSubmit: onSubmit({
			map: async ({ values }) => {
				const link = router.buildLocation({
					to: "/$locale/reset-password/$token",
					params: {
						locale,
						token: "-placeholder-",
					},
				});
				const redirectTo = new URL(link.href, import.meta.env.VITE_ORIGIN).toString();

				return {
					email: values.email,
					redirectTo,
				};
			},
			mutation,
		}),
	});

	return (
		<Container
			data-ui="ForgotPasswordPage"
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-scroll="vertical"
				data-ui-width="full"
				data-ui-height="content"
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
					textTitle={translator.text("Reset your password")}
					data-ui-inner="default"
				>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							void form.handleSubmit();
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
											data-ui={"ForgotPasswordPage[EmailInput]"}
											type={"email"}
											autoComplete={"email"}
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
											data-action={"send reset link"}
											data-ui={"ForgotPasswordPage[SubmitButton]"}
											iconEnabled={ChevronRightIcon}
											iconPosition={"right"}
											disabled={!isValid || isSubmitting}
										>
											{mutation.isPending ? (
												<Tx label={"Please wait..."} />
											) : (
												<Tx label={"Send reset link"} />
											)}
										</form.SubmitButton>

										<ErrorBadge
											placeholder
											error={mutation.error}
										/>
									</>
								)}
							</form.Subscribe>

							<LinkTo
								to={"/$locale/sign-in"}
								params={{
									locale,
								}}
							>
								<Tx
									label={"Back to sign in"}
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
	);
};
