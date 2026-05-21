import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useTranslator } from "@/lib/client/translation";
import { z } from "zod";
import { useAppForm } from "~/common/ui/form";
import { onSubmit } from "@/lib/client/submit";
import { useLocale } from "@/lib/client/locale";
import { useNavigate } from "@tanstack/react-router";
import { Status } from "@/lib/client/status";
import { LinkTo } from "@/lib/client/link-to";
import { Logo } from "~/common/ui/logo";
import { FormField } from "@/lib/client/form";
import { ChevronRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { ErrorBadge } from "@/lib/client/error";

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

export namespace WithMagic {
	export interface Props extends Container.Props {
		//
	}
}

export const WithMagic: FC<WithMagic.Props> = ({ ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const translator = useTranslator();
	const schema = useFormSchema();

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
		} satisfies z.infer<FormSchema>,
		validators: {
			onMount: schema,
			onSubmit: schema,
		},
		onSubmit: onSubmit({
			mutation: signInMutation,
		}),
	});

	return (
		<Container
			data-ui={"WithMagic"}
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			{...props}
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
				data-ui-width="full"
				data-ui-inner="xl"
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
										data-ui={"SignInPage[EmailInput]"}
										type={"email"}
										autoComplete={"email webauthn"}
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
										data-action={"sign in"}
										data-ui={"SignInPage[SubmitButton]"}
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

									<ErrorBadge
										placeholder
										error={signInMutation.error}
									/>
								</>
							)}
						</form.Subscribe>

						<LinkTo
							to={"/$locale/forgot/password"}
							params={{
								locale,
							}}
						>
							<Tx
								label={"Forgot password? (link)"}
								data-ui-tone="link"
								data-ui-theme="light"
								data-ui-text="md"
								data-ui-color="lead"
							/>
						</LinkTo>

						<LinkTo
							to={"/$locale/sign-up"}
							params={{
								locale,
							}}
						>
							<Tx
								label={"Register (link)"}
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
	);
};
