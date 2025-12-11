import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Nav } from "~/app/home/Nav";

export const Route = createFileRoute("/$locale/home")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				data-ui="/home[Container]"
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
				}}
			>
				<Container
					ui={{
						tone: "neutral",
						theme: "light",
						shadow: true,
						height: "full",
						width: "full",
					}}
				>
					<Outlet />
				</Container>

				<Nav locale={locale} />
			</Container>
		);
	},
});
