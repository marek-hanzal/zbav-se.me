import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeed, tListingSort } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { ListingSortSelect } from "~/app/listing/ui/ListingSortSelect";

export namespace FeedSortValueList {
	export interface Props {
		feed: tFeed;
	}
}

export const FeedSortValueList: FC<FeedSortValueList.Props> = ({ feed }) => {
	const [isEdit, setIsEdit] = useState(false);
	const [change, setChange] = useState(false);

	const [sort, setSort] = useState<tListingSort[]>(feed.query?.sort ?? []);

	const feedPatchMutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			setIsEdit(false);
		},
	});

	const withGeo = !!feed.query?.meta?.latLon;

	return (
		<>
			<ContainerValueList
				textTitle={"Feed sorting (label)"}
				textEmpty={"Feed sorting not selected"}
				items={sort.map((sortItem, index) => ({
					id: `${sortItem.field}-${index}`,
					...sortItem,
				}))}
				renderFn={(sortItem) => (
					<Tx
						tone={"secondary"}
						label={`Listing common sort value ${sortItem.field} - ${sortItem.direction}`}
					/>
				)}
				action={
					<Icon
						icon={EditIcon}
						size={"sm"}
					/>
				}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				header={{
					close: true,
					title: "Feed sorting (title)",
				}}
			>
				<Container
					layout={"vertical-content-footer"}
					gap={"md"}
					height={"full"}
					square={"md"}
				>
					<ListingSortSelect
						withGeo={withGeo}
						value={sort}
						onChange={(sort) => {
							setChange(true);
							setSort(sort);
						}}
					/>

					<Button
						tone={"secondary"}
						theme={"dark"}
						label={"Feed - save (button)"}
						size={"xl"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate({
								...feed,
								query: {
									...feed.query,
									sort,
								},
							});
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
