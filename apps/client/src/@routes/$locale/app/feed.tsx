import { createFileRoute } from "@tanstack/react-router";
import { Data, Status } from "@use-pico/client";
import { withListingCollectionQuery } from "~/app/listing/query/withListingCollectionQuery";
import { ListingPreview } from "~/app/listing/ui/ListingPreview";
import { FlowContainer } from "~/app/ui/container/FlowContainer";

export const Route = createFileRoute("/$locale/app/feed")({
	component() {
		const listingQuery = withListingCollectionQuery().useQuery({
			cursor: {
				page: 0,
				size: 5,
			},
			sort: [
				{
					value: "createdAt",
					sort: "asc",
				},
			],
		});

		return (
			<FlowContainer
				layout={"vertical-full"}
				snap={"vertical-center"}
				overflow={"vertical"}
			>
				<Data
					result={listingQuery}
					renderSuccess={({ data }) => {
						if (data.data.length === 0) {
							return (
								<Status
									icon={"icon-[streamline--sad-face-remix]"}
									textTitle={"No listings (title)"}
									textMessage={"No listings found (message)"}
								/>
							);
						}

						return data.data.map((listing) => {
							return (
								<ListingPreview
									key={listing.id}
									listing={listing}
								/>
							);
						});
					}}
				/>
			</FlowContainer>
		);
	},
});
