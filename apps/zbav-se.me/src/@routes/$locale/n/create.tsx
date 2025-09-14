import { createFileRoute } from "@tanstack/react-router";
import { ColumnLayout } from "@use-pico/client";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { Nav } from "~/app/ui/nav/Nav";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<ColumnLayout layout="content-footer">
				<CreateListing photoCountLimit={10} />

				<Nav active="create" />
			</ColumnLayout>
		);
	},
});
