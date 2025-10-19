import { createFileRoute } from "@tanstack/react-router";
import { Data } from "@use-pico/client";
import { withListingFetchQuery } from "~/app/listing/query/withListingFetchQuery";
import { Sheet } from "~/app/sheet/Sheet";

export const Route = createFileRoute("/$locale/app/listing/$id/view")({
	component() {
		const { id } = Route.useParams();
		const listingQuery = withListingFetchQuery().useQuery({
			where: {
				id,
			},
		});

		return (
			<Sheet>
				<Data
					result={listingQuery}
					renderSuccess={({ data }) => {
						return data.id;
					}}
				/>
			</Sheet>
		);
	},
});
