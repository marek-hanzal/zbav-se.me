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
import { useRef } from "react";
import { withRegisterMutation } from "~/app/auth/withRegisterMutation";
import { useAppForm } from "~/app/form/useAppForm";
import { Sheet } from "~/app/sheet/Sheet";
import { Fade } from "~/app/ui/fade/Fade";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";
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
					to: "/$locale/app/dashboard",
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
			},
			async onSubmit({ value }) {
				return registerMutation.mutateAsync({
					email: value.email,
					password: value.password,
				});
			},
		});

		const scrollerRef = useRef<HTMLDivElement>(null);

		return (
			<Sheet>
				<PrimaryOverlay />

				<Fade scrollableRef={scrollerRef} />

				<Container
					ref={scrollerRef}
					square={"xl"}
					layout={"vertical"}
					overflow={"vertical"}
				>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "primary",
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
								name={"email"}
								validators={{
									onBlur({ value, fieldApi }) {
										if (!fieldApi.state.meta.isDirty) {
											return undefined;
										}

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
									onBlur({ value, fieldApi }) {
										if (!fieldApi.state.meta.isDirty) {
											return undefined;
										}

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
									"inline-flex items-center justify-center w-full p-4"
								}
							>
								<form.SubmitButton
									iconEnabled={
										"icon-[eos-icons--system-re-registered]"
									}
									iconProps={{
										size: "sm",
									}}
									disabled={registerMutation.isPending}
									tone={"primary"}
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

							<div className={"flex flex-col gap-2 w-full"}>
								<Tx
									label={"Agreement with (label)"}
									size={"sm"}
									font={"bold"}
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
										tone={"link"}
										tweak={{
											slot: {
												root: {
													class: [
														"text-wrap",
													],
												},
											},
										}}
										size={"lg"}
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
										tone={"link"}
										tweak={{
											slot: {
												root: {
													class: [
														"text-wrap",
													],
												},
											},
										}}
										size={"lg"}
									/>
								</LinkTo>
							</div>
						</form>
					</VariantProvider>
				</Container>
			</Sheet>
		);
	},
});
