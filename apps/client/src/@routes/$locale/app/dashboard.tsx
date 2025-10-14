import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client";
import { Sheet } from "~/app/sheet/Sheet";

export const Route = createFileRoute("/$locale/app/dashboard")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Sheet>
				<LinkTo
					to="/$locale/app/listing/create"
					params={{
						locale,
					}}
				>
					[Create listing]
				</LinkTo>
				<LinkTo
					to="/$locale/app/user"
					params={{
						locale,
					}}
				>
					[User]
				</LinkTo>
			</Sheet>
		);
	},
});
