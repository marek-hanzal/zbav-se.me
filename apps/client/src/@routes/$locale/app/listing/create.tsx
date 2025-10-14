import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { CreateListingProvider } from "~/app/listing/context/CreateListingProvider";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";

export const Route = createFileRoute("/$locale/app/listing/create")({
	component() {
		return (
			<Container layout={"vertical-content-footer"}>
				<PrimaryOverlay opacity={"50"} />

				<CreateListingProvider photoCountLimit={10}>
					<CreateListing />
				</CreateListingProvider>

				{/* <Nav active="create" /> */}
			</Container>
		);
	},
});
