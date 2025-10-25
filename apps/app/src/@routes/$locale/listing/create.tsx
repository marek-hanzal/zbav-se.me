import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { PrimaryOverlay } from "@zbav-se.me/ui";
import { CreateListingProvider } from "~/app/listing/context/CreateListingProvider";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/listing/create")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container layout={"vertical-content-footer"}>
				<PrimaryOverlay opacity={"50"} />

				<CreateListingProvider
					photoCountLimit={10}
					defaultCurrency={
						countryToCurrency[locale as countryToCurrency.Key] ??
						countryToCurrency.unknown
					}
				>
					<CreateListing locale={locale} />
				</CreateListingProvider>
			</Container>
		);
	},
});
