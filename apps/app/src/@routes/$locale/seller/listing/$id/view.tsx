import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Sheet } from "@zbav-se.me/ui";
import { withListingFetchQuery } from "~/app/listing/query/withListingFetchQuery";
import { withLocationFetchQuery } from "~/app/location/query/withLocationFetchQuery";

export const Route = createFileRoute("/$locale/seller/listing/$id/view")({
	component() {
		const { id, locale } = Route.useParams();
		const listingQuery = withListingFetchQuery.useQuery({
			where: {
				id,
			},
		});
		const locationQuery = withLocationFetchQuery.useQuery(
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
				<Sheet>
					<Data
						result={listingQuery}
						renderSuccess={({ data }) => {
							return (
								<div className={"flex flex-col gap-2 px-4"}>
									<div>
										<PriceInline
											locale={locale}
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
										to={"/$locale/dashboard"}
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
											src={image.upload.url}
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
