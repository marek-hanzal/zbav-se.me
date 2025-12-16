import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";

export const Route = createFileRoute("/$locale/seller/listing/$id/view")({
	component() {
		const { id, locale } = Route.useParams();
		const listingQuery = withListingFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
		});

		return (
			<Container>
				<div className={"flex flex-col gap-2 px-4"}>
					<div>
						<PriceInline
							locale={locale}
							price={listingQuery.data.price}
							currency={listingQuery.data.currency}
						/>
					</div>
					{listingQuery.data.location.address}

					<LinkTo
						to={"/$locale/ui/home"}
						params={{
							locale,
						}}
					>
						[Dashboard]
					</LinkTo>

					{listingQuery.data.gallery.items.map((image) => (
						<img
							key={image.id}
							className={"w-full"}
							src={image.upload.url}
							alt={image.id}
						/>
					))}
				</div>
			</Container>
		);
	},
});
