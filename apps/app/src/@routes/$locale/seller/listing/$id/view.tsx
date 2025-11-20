import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { Sheet } from "@zbav-se.me/ui/sheet";

export const Route = createFileRoute("/$locale/seller/listing/$id/view")({
	component() {
		const { id, locale } = Route.useParams();
		const listingQuery = withListingFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
		});
		const locationQuery = withLocationFetchQuery.useSuspenseQuery({
			enabled: !!listingQuery.data?.locationId,
			where: {
				id: listingQuery.data?.locationId,
			},
		});

		return (
			<Container square={"md"}>
				<Sheet>
					<div className={"flex flex-col gap-2 px-4"}>
						<div>
							<PriceInline
								locale={locale}
								price={listingQuery.data.price}
								currency={listingQuery.data.currency}
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

						{listingQuery.data.gallery.map((image) => (
							<img
								key={image.id}
								className={"w-full"}
								src={image.upload.url}
								alt={image.id}
							/>
						))}
					</div>
				</Sheet>
			</Container>
		);
	},
});
