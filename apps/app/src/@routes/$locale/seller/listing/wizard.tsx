import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { PrimaryOverlay } from "@zbav-se.me/ui";

export const Route = createFileRoute("/$locale/seller/listing/wizard")({
	component() {
		return (
			<Container ui="ListingWizard-root">
				<PrimaryOverlay />

				<Container ui="ListingWizard-content">
					<Outlet />
				</Container>
			</Container>
		);
	},
});
