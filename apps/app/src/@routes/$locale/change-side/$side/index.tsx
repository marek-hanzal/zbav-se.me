import { createFileRoute, redirect } from "@tanstack/react-router";
import type { tUserSide } from "@zbav-se.me/sdk/api/session";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/session";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import { match } from "ts-pattern";

export const Route = createFileRoute("/$locale/change-side/$side/")({
	pendingComponent() {
		return <SpinnerContainer />;
	},
	async loader({ context: { queryClient }, params: { side, locale } }) {
		await withUserExPatchMutation.mutate(queryClient, {
			side: side === "none" ? null : (side as tUserSide),
		});

		return match(side as tUserSide | "none")
			.with("none", () =>
				redirect({
					to: "/$locale/dashboard",
					params: {
						locale,
					},
				}),
			)
			.with("buyer", () =>
				redirect({
					to: "/$locale/buyer",
					params: {
						locale,
					},
				}),
			)
			.with("seller", () =>
				redirect({
					to: "/$locale/seller",
					params: {
						locale,
					},
				}),
			)
			.exhaustive();
	},
});
