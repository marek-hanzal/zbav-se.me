import { zodResolver } from "@hookform/resolvers/zod";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import type { FC } from "react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { z } from "zod";

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

	return (
		<Form
			onSubmit={handleSubmit}
			method={"POST"}>
			<label>
				[Name:]
				<input
					type={"text"}
					className={"border border-blue-400"}
					{...register("name")}
				/>
				{errors.name && <div>{errors.name.message}</div>}
			</label>
			<label>
				[Email:]
				<input
					type={"email"}
					className={"border border-blue-400"}
					{...register("email")}
				/>
				{errors.email && <div>{errors.email.message}</div>}
			</label>
			<label>
				[Password:]
				<input
					type={"password"}
					className={"border border-blue-400"}
					{...register("password")}
				/>
				{errors.password && <div>{errors.password.message}</div>}
			</label>
			<label>
				[Confirm Password:]
				<input
					type={"password"}
					className={"border border-blue-400"}
					{...register("confirm")}
				/>
				{errors.confirm && <div>{errors.confirm.message}</div>}
			</label>
			<button type={"submit"}>Submit</button>
		</Form>
	);
};

export default function SignUp() {
	return <SignUpForm />;
}
