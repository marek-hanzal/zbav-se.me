import { createFileRoute } from "@tanstack/react-router";
import { Container, Data } from "@use-pico/client";
import { withListingFetchQuery } from "~/app/listing/query/withListingFetchQuery";
import { Sheet } from "~/app/sheet/Sheet";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";

export const Route = createFileRoute("/$locale/app/listing/$id/view")({
	component() {
		const { id } = Route.useParams();
		const listingQuery = withListingFetchQuery().useQuery({
			where: {
				id,
			},
		});

		return (
			<Container
				square={"md"}
				tone={"secondary"}
				theme={"light"}
			>
				<PrimaryOverlay />

				<Sheet>
					<Data
						result={listingQuery}
						renderSuccess={({ data }) => {
							return data.id;
						}}
					/>
				</Sheet>
			</Container>
		);
	},
});
