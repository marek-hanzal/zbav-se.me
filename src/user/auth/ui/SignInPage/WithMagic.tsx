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
import { withMagicLinkSignInMutation } from "../../mutation/withMagicLinkSignInMutation";

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
		target?: string;
	}
}

export const WithMagic: FC<WithMagic.Props> = ({ target, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const router = useRouter();
	const translator = useTranslator();
	const schema = useFormSchema();

	const signInMutation = withMagicLinkSignInMutation.useMutation({
		async onPostMutation() {
			return navigate({
				to: "/$locale/status/magic-link",
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
			onSubmit: schema,
		},
		onSubmit: onSubmit({
			map: async ({ values }) => {
				if (target) {
					return {
						email: values.email,
						callbackURL: target,
					};
				}

				const link = router.buildLocation({
					to: "/$locale/app/home",
					params: {
						locale,
					},
				});

				return {
					email: values.email,
					callbackURL: new URL(link.href, import.meta.env.VITE_ORIGIN).toString(),
				};
			},
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
										data-ui={"SignInPage[MagicEmailInput]"}
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
										data-action={"sign in with magic link"}
										data-ui={"SignInPage[SubmitButton]"}
										iconEnabled={ChevronRightIcon}
										iconPosition={"right"}
										disabled={!isValid || isSubmitting}
									>
										{signInMutation.isPending ? (
											<Tx label={"Please wait..."} />
										) : (
											<Tx label={"Send magic link (label)"} />
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
