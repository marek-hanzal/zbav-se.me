import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { CreateListingProvider } from "~/app/listing/context/CreateListingProvider";
import { CreateListing } from "~/app/listing/ui/CreateListing";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<Container layout={"vertical-content-footer"}>
				<CreateListingProvider photoCountLimit={10}>
					<CreateListing />
				</CreateListingProvider>

				{/* <Nav active="create" /> */}
			</Container>
		);
	},
});
