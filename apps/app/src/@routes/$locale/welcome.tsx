import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";

export const Route = createFileRoute("/$locale/welcome")({
	component() {
		const { locale } = Route.useParams();

		return (
			<div>
				"onboarding or something"
				<LinkTo
					to={"/$locale/ui/home"}
					params={{
						locale,
					}}
				>
					home
				</LinkTo>
			</div>
		);
	},
});
