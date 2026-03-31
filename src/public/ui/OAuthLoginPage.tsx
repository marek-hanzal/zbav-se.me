import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { withEmailSignInMutation } from "~/common/auth/mutation/withEmailSignInMutation";
import type { OAuthSearchSchema } from "~/common/auth/schema/OAuthSearchSchema";
import { useAppForm } from "~/common/ui/form";
import { Logo } from "~/common/ui/logo";

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

export namespace OAuthLoginPage {
	export interface Props {
		locale: string;
		query: OAuthSearchSchema.Type;
	}
}

export const OAuthLoginPage = ({ locale, query }: OAuthLoginPage.Props) => {
	const navigate = useNavigate();

	const signInMutation = withEmailSignInMutation.useMutation({
		async onPostMutation() {
			return navigate({
				to: "/api/oauth/authorize",
				search: query,
			});
		},
	});

	// const passkeyMutation = useMutation({
	// 	async mutationFn() {
	// 		await authClient.signIn.passkey();
	// 		await withContinueOAuth(locale, query);
	// 	},
	// });

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

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				width: "full",
				inner: "xl",
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
										autoComplete={"email webauthn"}
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
										autoComplete={"current-password webauthn"}
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

					{signInMutation.isError && (
						<div className={"rounded-md bg-red-50 p-3 text-red-700"}>
							{signInMutation.error instanceof Error ? (
								signInMutation.error.message
							) : (
								<Tx label={"Login failed"} />
							)}
						</div>
					)}

					<form.SubmitButton
						iconEnabled={ChevronRightIcon}
						iconPosition={"right"}
						disabled={signInMutation.isPending}
					>
						{signInMutation.isPending ? (
							<Tx label={"Please wait..."} />
						) : (
							<Tx label={"Sign in (button)"} />
						)}
					</form.SubmitButton>
				</form>
			</Status>

			{/* <Status
				icon={PassKeyIcon}
				textTitle={translator.text("Login with passkey (title)")}
				textMessage={translator.text("Login with passkey (message)")}
				action={
					<Button
						iconEnabled={UnlockIcon}
						iconProps={{
							ui: {
								text: "2xl",
							},
						}}
						onClick={() => {
							passkeyMutation.mutate();
						}}
						disabled={passkeyMutation.isPending}
						ui={{
							size: "xl",
							tone: "primary",
							theme: "light",
							text: "lg",
						}}
					>
						<Tx label={"Login with passkey"} />
					</Button>
				}
				ui={{
					width: "full",
				}}
				className={"text-center"}
			/> */}
		</Container>
	);
};
