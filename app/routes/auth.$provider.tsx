import { type ActionFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/auth.server";

export const loader = () => redirect("/login");

export const action = ({ request, params }: ActionFunctionArgs) => {
	invariant(params.provider, "Provider is required");
	return authenticator.authenticate(params.provider, request);
};
