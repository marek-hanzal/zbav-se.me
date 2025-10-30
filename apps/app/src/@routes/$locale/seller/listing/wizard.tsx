import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Container } from "@use-pico/client";

export const Route = createFileRoute("/$locale/seller/listing/wizard")({
	component() {
		return (
			<Container ui="ListingWizard-root">
				<Container ui="ListingWizard-content">
					<Outlet />
				</Container>
			</Container>
		);
	},
});
