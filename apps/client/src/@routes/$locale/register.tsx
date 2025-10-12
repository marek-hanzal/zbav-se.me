import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	Container,
	FormField,
	LinkTo,
	Status,
	Tx,
	UserIcon,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import { withRegisterMutation } from "~/app/auth/withRegisterMutation";
import { useAppForm } from "~/app/form/useAppForm";
import { Sheet } from "~/app/sheet/Sheet";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const Route = createFileRoute("/$locale/register")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
		const navigate = useNavigate();

		const registerMutation = withRegisterMutation.useMutation({
			async onSuccess() {
				await navigate({
					to: "/$locale/n/feed",
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
				name: "",
			},
			async onSubmit({ value }) {
				return registerMutation.mutateAsync({
					email: value.email,
					password: value.password,
					name: value.name,
				});
			},
		});

		return (
			<Sheet>
				<Container square={"xl"}>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<Status
							icon={UserIcon}
							textTitle={<Tx label={"Register (title)"} />}
							textMessage={
								<LinkTo
									to={"/$locale/login"}
									params={{
										locale,
									}}
								>
									<Tx
										label={"Login (link)"}
										tone={"link"}
									/>
								</LinkTo>
							}
						/>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className={"space-y-2"}
						>
							<form.AppField
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
										id={field.name}
										name={field.name}
										label={<Tx label={"Name"} />}
										meta={field.state.meta}
									>
										{(props) => (
											<field.TextInput
												type={"text"}
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												onBlur={field.handleBlur}
												placeholder={translator.text(
													"Enter your name",
												)}
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>

							<form.AppField
								name={"email"}
								validators={{
									onBlur({ value }) {
										if (!value) {
											return {
												message:
													translator.text(
														"Email is required",
													),
											};
										}
										if (
											!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
												value,
											)
										) {
											return {
												message: translator.text(
													"Invalid email address",
												),
											};
										}
										return undefined;
									},
								}}
							>
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
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												onBlur={field.handleBlur}
												placeholder={translator.text(
													"Enter your email",
												)}
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>

							<form.AppField
								name={"password"}
								validators={{
									onBlur({ value }) {
										if (!value || value.length < 8) {
											return {
												message: translator.text(
													"Password must be at least 8 characters",
												),
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
										{(props) => (
											<field.TextInput
												type={"password"}
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												onBlur={field.handleBlur}
												placeholder={translator.text(
													"Enter your password",
												)}
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>

							<form.AppField
								name={"confirmPassword"}
								validators={{
									onChangeListenTo: [
										"password",
									],
									onBlur({ value, fieldApi }) {
										const password =
											fieldApi.form.getFieldValue(
												"password",
											);

										if (value !== password) {
											return {
												message: translator.text(
													"Passwords do not match",
												),
											};
										}

										return undefined;
									},
								}}
							>
								{(field) => (
									<FormField
										id={field.name}
										name={field.name}
										label={
											<Tx label={"Confirm Password"} />
										}
										meta={field.state.meta}
									>
										{(props) => (
											<field.TextInput
												type={"password"}
												value={field.state.value}
												onChange={(e) =>
													field.handleChange(
														e.target.value,
													)
												}
												onBlur={field.handleBlur}
												placeholder={translator.text(
													"Confirm your password",
												)}
												{...props}
											/>
										)}
									</FormField>
								)}
							</form.AppField>

							<div
								className={
									"inline-flex items-center justify-center w-full"
								}
							>
								<form.SubmitButton
									iconEnabled={
										"icon-[eos-icons--system-re-registered]"
									}
									disabled={registerMutation.isPending}
									tone={"secondary"}
									theme={"dark"}
									size={"lg"}
								>
									{registerMutation.isPending ? (
										<Tx label={"Please wait..."} />
									) : (
										<Tx label={"Register"} />
									)}
								</form.SubmitButton>
							</div>
						</form>
					</VariantProvider>
				</Container>
			</Sheet>
		);
	},
});
