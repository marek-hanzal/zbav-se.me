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
			.with("none", () => {
				console.log("none -> dashboard");
				throw redirect({
					to: "/$locale/dashboard",
					params: {
						locale,
					},
					statusCode: 302,
				});
			})
			.with("buyer", () => {
				console.log("buyer -> buyer");
				throw redirect({
					to: "/$locale/buyer",
					params: {
						locale,
					},
					statusCode: 302,
				});
			})
			.with("seller", () => {
				console.log("seller -> seller");
				throw redirect({
					to: "/$locale/seller",
					params: {
						locale,
					},
					statusCode: 302,
				});
			})
			.exhaustive();
	},
});
