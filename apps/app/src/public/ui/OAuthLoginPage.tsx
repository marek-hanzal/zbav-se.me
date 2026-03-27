import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { linkTo } from "@use-pico/common/link-to";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import { Logo } from "@zbav-se.me/ui/logo";
import { z } from "zod";
import { withEmailSignInMutation } from "~/common/auth/mutation/withEmailSignInMutation";

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

const OAuthRequiredQueryKeys = [
	"response_type",
	"client_id",
	"redirect_uri",
	"state",
] as const;

const withHasOAuthChallenge = (query: Record<string, string>): boolean => {
	for (const key of OAuthRequiredQueryKeys) {
		if (!query[key]) {
			return false;
		}
	}

	return true;
};

const withContinueOAuth = async (locale: string, query: Record<string, string>) => {
	if (!withHasOAuthChallenge(query)) {
		window.location.href = `/${locale}/sign-in`;
		return;
	}

	window.location.href = linkTo({
		base: import.meta.env.VITE_SERVER_API,
		href: "/api/oauth/mcp/authorize",
		query,
	});
};

export namespace OAuthLoginPage {
	export interface Props {
		locale: string;
		query: Record<string, string>;
	}
}

export const OAuthLoginPage = ({ locale, query }: OAuthLoginPage.Props) => {
	const signInMutation = withEmailSignInMutation.useMutation({
		async onPostMutation() {
			return withContinueOAuth(locale, query);
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
