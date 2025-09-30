import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { Nav } from "~/app/ui/nav/Nav";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<Container
				layout={"vertical-content-footer"}
				square={"xs"}
				gap={"xs"}
			>
				<CreateListing photoCountLimit={10} />

				<Nav active="create" />
			</Container>
		);
	},
});
