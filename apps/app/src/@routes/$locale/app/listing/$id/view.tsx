import { createFileRoute } from "@tanstack/react-router";
import { Container, Data, LinkTo, PriceInline } from "@use-pico/client";
import { withListingFetchQuery } from "~/app/listing/query/withListingFetchQuery";
import { withLocationFetchQuery } from "~/app/location/query/withLocationFetchQuery";
import { Sheet } from "~/app/sheet/Sheet";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";

export const Route = createFileRoute("/$locale/app/listing/$id/view")({
	component() {
		const { id, locale } = Route.useParams();
		const listingQuery = withListingFetchQuery().useQuery({
			where: {
				id,
			},
		});
		const locationQuery = withLocationFetchQuery().useQuery(
			{
				where: {
					id: listingQuery.data?.locationId,
				},
			},
			{
				enabled: !!listingQuery.data?.locationId,
			},
		);

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
							return (
								<div className={"flex flex-col gap-2 px-4"}>
									<div>
										<PriceInline
											price={data.price}
											currency={data.currency}
										/>
									</div>
									<Data
										result={locationQuery}
										renderSuccess={({ data }) => {
											return data.address;
										}}
									/>

									<LinkTo
										to={`/$locale/app/dashboard`}
										params={{
											locale,
										}}
									>
										[Dashboard]
									</LinkTo>

									{data.gallery.map((image) => (
										<img
											key={image.id}
											className={"w-full"}
											src={image.url}
											alt={image.id}
										/>
									))}
								</div>
							);
						}}
					/>
				</Sheet>
			</Container>
		);
	},
});
