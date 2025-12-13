import { EditIcon, Icon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container, ValueList } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeed, tListingSort } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { CloseButton } from "@zbav-se.me/ui/button";
import { type FC, useState } from "react";
import { ListingSortSelect } from "~/app/listing/ui/ListingSortSelect";

export namespace SortValue {
	export interface Props {
		feed: tFeed;
	}
}

export const SortValue: FC<SortValue.Props> = ({ feed }) => {
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
			<ValueList
				data-ui={"SortValue[ValueList]"}
				textLabel={"Feed sorting (label)"}
				textEmpty={"Feed sorting not selected"}
				items={sort.map((sortItem, index) => ({
					id: `${sortItem.field}-${index}`,
					...sortItem,
				}))}
				renderFn={(sortItem) => (
					<Tx
						label={`Listing common sort value ${sortItem.field} - ${sortItem.direction}`}
						ui={{
							tone: "secondary",
						}}
					/>
				)}
				action={
					<Icon
						icon={EditIcon}
						ui={{
							text: "xl",
						}}
					/>
				}
				onClick={() => setIsEdit(true)}
			/>

			<BottomSheet
				data-ui={"SortValue-[BottomSheet]"}
				isOpen={isEdit}
				onClose={() => setIsEdit(false)}
				detent={"full"}
				header={({ close }) => ({
					title: "Feed sorting (title)",
					right: <CloseButton onClick={close} />,
				})}
			>
				<Container
					ui={{
						layout: "vertical-content-footer",
						height: "full",
						gap: "default",
					}}
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
						label={"Feed - save (button)"}
						loading={feedPatchMutation.isPending}
						disabled={!change || feedPatchMutation.isPending}
						onClick={() => {
							feedPatchMutation.mutate({
								patch: {
									...feed,
									query: {
										...feed.query,
										sort,
									},
								},
								query: {
									where: {
										id: feed.id,
									},
								},
							});
						}}
						ui={{
							tone: "secondary",
							theme: "dark",
							size: "xl",
						}}
					/>
				</Container>
			</BottomSheet>
		</>
	);
};
