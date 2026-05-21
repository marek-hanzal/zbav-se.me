import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SignInPage } from "~/user/auth/ui/SignInPage";

const appOrigin = import.meta.env.VITE_ORIGIN;

const SignInSearchSchema = z
	.looseObject({
		target: z
			.string()
			.optional()
			.transform((target) => {
				return appOrigin && target?.startsWith(appOrigin) ? target : undefined;
			}),
	})
	.strip();

export const Route = createFileRoute("/$locale/sign-in")({
	validateSearch: SignInSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { target } = Route.useSearch();

	return <SignInPage target={target} />;
}
