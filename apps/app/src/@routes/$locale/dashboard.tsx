import { createFileRoute, redirect } from "@tanstack/react-router";
import { match } from "ts-pattern";

export const Route = createFileRoute("/$locale/dashboard")({
	async loader({ context: { user }, params: { locale } }) {
		throw await match(user.side)
			.with("seller", async () => {
				return redirect({
					to: "/$locale/seller",
					params: {
						locale,
					},
				});
			})
			.with("buyer", undefined, null, async () => {
				/**
				 * Send the user to default feed (see the logic there).
				 *
				 * By the time of writing, it's last visited feed.
				 */
				return redirect({
					to: "/$locale/buyer/feed/default",
					params: {
						locale,
					},
				});
			})
			.exhaustive();
	},
});
