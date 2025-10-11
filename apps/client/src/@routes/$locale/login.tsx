import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Button, Container, FormField, Tx } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";
import { Sheet } from "~/app/sheet/Sheet";

interface LoginFormData {
	email: string;
	password: string;
}

export const Route = createFileRoute("/$locale/login")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
		const navigate = useNavigate();

		const loginMutation = useMutation({
			mutationFn: async (data: LoginFormData) => {
				const result = await authClient.signIn.email(data);

				if (result.error) {
					throw new Error(result.error.message || "Login failed");
				}

				return result.data;
			},
			onSuccess: () => {
				// Redirect to home page on success
				navigate({
					to: "/$locale/n/feed",
					params: {
						locale,
					},
				});
			},
		});

		const form = useForm({
			defaultValues: {
				email: "",
				password: "",
			},
			onSubmit: async ({ value }) => {
				loginMutation.mutate({
					email: value.email,
					password: value.password,
				});
			},
		});

		return (
			<Sheet>
				<Container square={"xl"}>
					<Tx
						label={"Login"}
						size={"xl"}
					/>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className={"space-y-4"}
					>
						<form.Field
							name={"email"}
							validators={{
								onChange: ({ value }) => {
									if (!value) {
										return {
											message: "Email is required",
										};
									}
									if (
										!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
											value,
										)
									) {
										return {
											message: "Invalid email address",
										};
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<FormField
									label={<Tx label={"Email"} />}
									meta={field.state.meta}
								>
									{() => (
										<input
											type={"email"}
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													e.target.value,
												)
											}
											onBlur={field.handleBlur}
											placeholder={"Enter your email"}
											className={
												"w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											}
											disabled={loginMutation.isPending}
										/>
									)}
								</FormField>
							)}
						</form.Field>

						<form.Field
							name={"password"}
							validators={{
								onChange: ({ value }) => {
									if (!value) {
										return {
											message: "Password is required",
										};
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<FormField
									label={<Tx label={"Password"} />}
									meta={field.state.meta}
								>
									{() => (
										<input
											type={"password"}
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													e.target.value,
												)
											}
											onBlur={field.handleBlur}
											placeholder={"Enter your password"}
											className={
												"w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											}
											disabled={loginMutation.isPending}
										/>
									)}
								</FormField>
							)}
						</form.Field>

						{loginMutation.isError && (
							<div
								className={
									"rounded-md bg-red-50 p-3 text-red-700"
								}
							>
								{loginMutation.error instanceof Error ? (
									loginMutation.error.message
								) : (
									<Tx label={"Login failed"} />
								)}
							</div>
						)}

						{loginMutation.isSuccess && (
							<div
								className={
									"rounded-md bg-green-50 p-3 text-green-700"
								}
							>
								<Tx
									label={"Login successful! Redirecting..."}
								/>
							</div>
						)}

						<div
							className={
								"inline-flex items-center justify-center w-full"
							}
						>
							<Button
								type={"submit"}
								disabled={loginMutation.isPending}
								tone={"secondary"}
								theme={"dark"}
							>
								{loginMutation.isPending ? (
									<Tx label={"Please wait..."} />
								) : (
									<Tx label={"Login"} />
								)}
							</Button>
						</div>
					</form>
				</Container>
			</Sheet>
		);
	},
});
