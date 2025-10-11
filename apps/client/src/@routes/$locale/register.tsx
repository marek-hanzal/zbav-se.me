import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Container, FormField, Tx } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";
import { Sheet } from "~/app/sheet/Sheet";

interface RegisterFormData {
	email: string;
	password: string;
	name: string;
}

export const Route = createFileRoute("/$locale/register")({
	component() {
		const navigate = useNavigate();

		const registerMutation = useMutation({
			mutationFn: async (data: RegisterFormData) => {
				const result = await authClient.signUp.email({
					email: data.email,
					password: data.password,
					name: data.name,
				});

				if (result.error) {
					throw new Error(
						result.error.message || "Registration failed",
					);
				}

				return result.data;
			},
			onSuccess: () => {
				// Redirect to home page on success
				navigate({
					to: "/$locale",
					params: {
						locale: "en",
					},
				});
			},
		});

		const form = useForm({
			defaultValues: {
				email: "",
				password: "",
				confirmPassword: "",
				name: "",
			},
			onSubmit: async ({ value }) => {
				registerMutation.mutate({
					email: value.email,
					password: value.password,
					name: value.name,
				});
			},
		});

		return (
			<Sheet>
				<Container square={"xl"}>
					<Tx
						label={"Register"}
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
							name={"name"}
							validators={{
								onChange: ({ value }) => {
									if (!value || value.length < 2) {
										return {
											message:
												"Name must be at least 2 characters",
										};
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<FormField
									label={<Tx label={"Name"} />}
									meta={field.state.meta}
								>
									{() => (
										<input
											type={"text"}
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													e.target.value,
												)
											}
											onBlur={field.handleBlur}
											placeholder={"Enter your name"}
											className={
												"w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											}
											disabled={
												registerMutation.isPending
											}
										/>
									)}
								</FormField>
							)}
						</form.Field>

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
											disabled={
												registerMutation.isPending
											}
										/>
									)}
								</FormField>
							)}
						</form.Field>

						<form.Field
							name={"password"}
							validators={{
								onChange: ({ value }) => {
									if (!value || value.length < 8) {
										return {
											message:
												"Password must be at least 8 characters",
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
											disabled={
												registerMutation.isPending
											}
										/>
									)}
								</FormField>
							)}
						</form.Field>

						<form.Field
							name={"confirmPassword"}
							validators={{
								onChangeListenTo: [
									"password",
								],
								onChange: ({ value, fieldApi }) => {
									const password =
										fieldApi.form.getFieldValue("password");
									if (value !== password) {
										return {
											message: "Passwords do not match",
										};
									}
									return undefined;
								},
							}}
						>
							{(field) => (
								<FormField
									label={<Tx label={"Confirm Password"} />}
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
											placeholder={
												"Confirm your password"
											}
											className={
												"w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
											}
											disabled={
												registerMutation.isPending
											}
										/>
									)}
								</FormField>
							)}
						</form.Field>

						{registerMutation.isError && (
							<div
								className={
									"rounded-md bg-red-50 p-3 text-red-700"
								}
							>
								{registerMutation.error instanceof Error ? (
									registerMutation.error.message
								) : (
									<Tx label={"Registration failed"} />
								)}
							</div>
						)}

						{registerMutation.isSuccess && (
							<div
								className={
									"rounded-md bg-green-50 p-3 text-green-700"
								}
							>
								<Tx
									label={
										"Registration successful! Redirecting..."
									}
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
								disabled={registerMutation.isPending}
								tone={"secondary"}
								theme={"dark"}
							>
								{registerMutation.isPending ? (
									<Tx label={"Please wait..."} />
								) : (
									<Tx label={"Register"} />
								)}
							</Button>
						</div>
					</form>
				</Container>
			</Sheet>
		);
	},
});
