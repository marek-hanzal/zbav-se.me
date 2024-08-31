import { type ActionFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/auth/auth.server";

export const action = async ({ request }: ActionFunctionArgs) => {
	await authenticator.logout(request, { redirectTo: "/" });
};
