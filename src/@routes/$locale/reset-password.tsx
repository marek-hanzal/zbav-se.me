import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordPage } from "~/user/auth/ui/ResetPasswordPage";

const ResetPasswordSearchSchema = z
	.looseObject({
		error: z.string().optional(),
		token: z.string().optional(),
	})
	.strip();

export const Route = createFileRoute("/$locale/reset-password")({
	validateSearch: ResetPasswordSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { error, token } = Route.useSearch();

	return (
		<ResetPasswordPage
			resetError={error}
			token={token}
		/>
	);
}
