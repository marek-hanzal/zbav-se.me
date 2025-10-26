import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { PrimaryOverlay } from "@zbav-se.me/ui";
import { CreateListingProvider } from "~/app/listing/context/CreateListingProvider";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/listing/wizard")({
	component() {
		const { locale } = Route.useParams();

		return (
			<CreateListingProvider
				photoCountLimit={10}
				defaultCurrency={
					countryToCurrency[locale as countryToCurrency.Key] ??
					countryToCurrency.unknown
				}
			>
				<Container ui="ListingWizard-root">
					<PrimaryOverlay />

					<Container ui="ListingWizard-content">
						<Outlet />
					</Container>
				</Container>
			</CreateListingProvider>
		);
	},
});
