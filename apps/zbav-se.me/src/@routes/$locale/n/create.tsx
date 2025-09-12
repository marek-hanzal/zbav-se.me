import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@use-pico/client";
import { CreateListing } from "~/app/listing/ui/CreateListing";
import { Layout } from "~/app/ui/layout/Layout";
import { Nav } from "~/app/ui/nav/Nav";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		return (
			<Layout layout="content-footer">
				<Icon
					icon={"icon-[akar-icons--question]"}
					size="sm"
					tone="secondary"
					theme={"light"}
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"absolute",
								"inset-0",
								"z-10",
								"top-8",
								"left-8",
							]),
						}),
					})}
				/>

				<CreateListing photoCountLimit={10} />

				<Nav active="create" />
			</Layout>
		);
	},
});
