import { createFileRoute } from "@tanstack/react-router";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { Layout } from "~/app/ui/layout/Layout";
import { Nav } from "~/app/ui/nav/Nav";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<Layout layout="content-footer">
				<CreateListing photoCountLimit={10} />

				<Nav active="create" />
			</Layout>
		);
	},
});
