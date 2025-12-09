import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { FormField, onSubmit } from "@use-pico/client/ui/form";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { linkTo } from "@use-pico/common/link-to";
import { translator } from "@use-pico/common/translator";
import { CheckIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import { useRef } from "react";
import { withRegisterMutation } from "~/app/auth/withRegisterMutation";
import { useAppForm } from "~/app/form/useAppForm";

export const Route = createFileRoute("/$locale/register")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});
		const navigate = useNavigate();

		const registerMutation = withRegisterMutation.useMutation({
			async onPostMutation() {
				return navigate({
					href: linkTo({
						base: import.meta.env.VITE_APP_ORIGIN,
						href: "/:locale/buyer/feed/default",
						query: {
							locale,
						},
					}),
				});
			},
		});

		const form = useAppForm({
			defaultValues: {
				email: "",
				password: "",
				confirmPassword: "",
			},
			onSubmit: onSubmit({
				mutation: registerMutation,
			}),
		});

		const scrollerRef = useRef<HTMLDivElement>(null);

		return (
			<Container>
				<Fade scrollableRef={scrollerRef} />

				<Container
					ref={scrollerRef}
					ui={{
						inner: "default",
						layout: "vertical",
						scroll: "vertical",
					}}
				>
					<Container
						ui={{
							layout: "vertical-centered",
						}}
					>
						<Status
							icon={<Logo />}
							textTitle={"Register (title)"}
						>
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
													message: translator.text("Email is required"),
												};
											}
											if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
												return {
													message:
														translator.text("Invalid email address"),
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
														field.handleChange(e.target.value)
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
														field.handleChange(e.target.value)
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
												fieldApi.form.getFieldValue("password");

											if (value !== password) {
												return {
													message:
														translator.text("Passwords do not match"),
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
											label={<Tx label={"Confirm Password"} />}
											meta={field.state.meta}
										>
											{(props) => (
												<field.TextInput
													type={"password"}
													value={field.state.value}
													onChange={(e) =>
														field.handleChange(e.target.value)
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

								<Container
									ui={{
										layout: "vertical-flex",
										gap: "sm",
									}}
								>
									<form.SubmitButton
										iconEnabled={"icon-[eos-icons--system-re-registered]"}
										iconProps={{
											ui: {
												size: "sm",
											},
										}}
										disabled={registerMutation.isPending}
										ui={{
											tone: "primary",
											theme: "dark",
											size: "xl",
										}}
									>
										{registerMutation.isPending ? (
											<Tx label={"Please wait..."} />
										) : (
											<Tx label={"Register"} />
										)}
									</form.SubmitButton>

									<LinkTo
										to={"/$locale/login"}
										params={{
											locale,
										}}
									>
										<Tx
											label={"Login (link)"}
											ui={{
												tone: "link",
											}}
										/>
									</LinkTo>
								</Container>

								<div className={"flex flex-col gap-2 w-full"}>
									<Tx
										label={"Agreement with (label)"}
										ui={{
											size: "sm",
											font: "bold",
										}}
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
											ui={{
												tone: "link",
												size: "lg",
											}}
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
											ui={{
												tone: "link",
												size: "lg",
											}}
										/>
									</LinkTo>
								</div>
							</form>
						</Status>
					</Container>
				</Container>
			</Container>
		);
	},
});
