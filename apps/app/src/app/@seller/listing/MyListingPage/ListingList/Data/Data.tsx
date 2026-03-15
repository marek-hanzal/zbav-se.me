import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller/listing";
import { type FC, useMemo } from "react";
import { CreateButton } from "~/app/@seller/draft/~public/CreateButton";
import { ListingItem } from "../ListingItem";
import { Empty } from "./Empty";

export namespace Data {
	export interface Props extends Container.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ ui, ...props }) => {
	const { data: listingCollection } = withListingQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 100,
		},
		sort: [
			{
				field: "createdAt",
				order: "desc",
			},
		],
	});

	const check = useMemo(() => {
		return [
			{
				check() {
					return !listingCollection.length;
				},
				render() {
					return <Empty />;
				},
			},
		] as EmptyState.Check[];
	}, [
		listingCollection,
	]);

	return (
		<Container
			data-ui={"MyListing[Container]"}
			ui={{
				flow: "vertical",
				scroll: "vertical",
				height: "full",
				gap: "default",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<EmptyState check={check}>
				{listingCollection.map((listingId) => {
					return (
						<ListingItem
							key={listingId}
							listingId={listingId}
						/>
					);
				})}

				<CreateButton />
			</EmptyState>
		</Container>
	);
};
