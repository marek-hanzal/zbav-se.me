import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { CreateListingProvider } from "~/app/listing/context/CreateListingProvider";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";
import { countryToCurrency } from "~/locales";

export const Route = createFileRoute("/$locale/app/listing/create")({
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
