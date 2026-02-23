import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Nav } from "~/app/@common/nav/ui/Nav";

export const Route = createFileRoute("/$locale/ui")({
	component() {
		return (
			<Container
				data-ui="Ui[Container]"
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

				<Nav />
			</Container>
		);
	},
});
