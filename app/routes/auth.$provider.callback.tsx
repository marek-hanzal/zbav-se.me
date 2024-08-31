import { type LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticator } from "~/auth/auth.server";

export const loader = ({ request, params }: LoaderFunctionArgs) => {
	invariant(params.provider, "Provider is required");
	return authenticator.authenticate(params.provider, request, {
		successRedirect: "/dashboard",
		failureRedirect: "/login",
	});
};
