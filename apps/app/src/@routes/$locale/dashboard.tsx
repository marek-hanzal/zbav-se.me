import { createFileRoute, redirect } from "@tanstack/react-router";
import { match } from "ts-pattern";

export const Route = createFileRoute("/$locale/dashboard")({
	loader({ context: { user }, params: { locale } }) {
		throw match(user.side)
			.with("buyer", () => {
				return redirect({
					to: "/$locale/buyer",
					params: {
						locale,
					},
				});
			})
			.with("seller", () => {
				return redirect({
					to: "/$locale/seller",
					params: {
						locale,
					},
				});
			})
			.with(undefined, null, () => {
				return redirect({
					to: "/$locale/buyer",
					params: {
						locale,
					},
				});
			})
			.exhaustive();
	},
});
