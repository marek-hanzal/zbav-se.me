import { zodResolver } from "@hookform/resolvers/zod";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";
import { tvaInput } from "~/theme/tvaInput";

const SignUpSchema = z
	.object({
		name: z.string().min(2).max(64),
		email: z.string().email(),
		password: z.string().min(6).max(128),
		confirm: z.string().min(6).max(128),
	})
	.refine((data) => data.password === data.confirm, {
		message: "Passwords do not match",
		path: ["confirm"],
	});
type SignUpSchema = z.infer<typeof SignUpSchema>;

const resolver = zodResolver(SignUpSchema);

export const action = async ({ request }: ActionFunctionArgs) => {
	const { data, errors, receivedValues } = await getValidatedFormData<SignUpSchema>(request, resolver);
	if (errors) {
		return json({ errors, defaultValues: receivedValues });
	}

	// do the sign-up stuff
	console.log("yaay", data);

	return data;
};

const SignUpForm: FC = () => {
	const {
		handleSubmit,
		formState: { errors },
		register,
	} = useRemixForm<SignUpSchema>({
		mode: "onSubmit",
		resolver,
	});
	const { t } = useTranslation();

	const tv = tvaInput();

	return (
		<Form
			onSubmit={handleSubmit}
			method={"POST"}
			className={"flex-1"}>
			<div className={tv.base()}>
				<label
					htmlFor={"name"}
					className={tv.label()}>
					{t("Name")}
				</label>
				<input
					id={"name"}
					type={"text"}
					className={tv.input()}
					{...register("name")}
				/>
				{errors.name && <div>{errors.name.message}</div>}
			</div>

			<div className={tv.base()}>
				<label
					htmlFor={"email"}
					className={tv.label()}>
					{t("Email")}
				</label>
				<input
					id={"email"}
					type={"email"}
					className={tv.input()}
					{...register("email")}
				/>
				{errors.email && <div>{errors.email.message}</div>}
			</div>

			<div className={tv.base()}>
				<label
					htmlFor={"password"}
					className={tv.label()}>
					{t("Password")}
				</label>
				<input
					id={"password"}
					type={"password"}
					className={tv.input()}
					{...register("password")}
				/>
				{errors.password && <div>{errors.password.message}</div>}
			</div>

			<div className={tv.base()}>
				<label
					htmlFor={"confirm"}
					className={tv.label()}>
					{t("Confirm Password")}
				</label>
				<input
					id={"confirm"}
					type={"password"}
					className={tv.input()}
					{...register("confirm")}
				/>
				{errors.confirm && <div>{errors.confirm.message}</div>}
			</div>

			<div className={"flex items-center justify-between"}>
				<span className={"text-sm text-orange-600"}>{t("Already registered?")}</span>
				<Link to={"/auth/sign-in"}>{t("Sign in")}</Link>
			</div>

			<div className={"flex items-center"}>
				<button type={"submit"}>{t("Sign-up")}</button>
			</div>
		</Form>
	);
};

export default function SignUp() {
	return (
		<div>
			<div className={"h-24 w-full bg-amber-400"}>[Logo here]</div>
			<SignUpForm />
		</div>
	);
}
