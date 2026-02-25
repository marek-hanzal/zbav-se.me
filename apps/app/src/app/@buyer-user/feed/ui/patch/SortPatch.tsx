import type { Container } from "@use-pico/client/ui/container";
import type { tFeed, tListingSort } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { type FC, useState } from "react";
import { ListingSortSelect } from "~/app/@buyer-user/listing/ui/ListingSortSelect";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";

export namespace SortPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const SortPatch: FC<SortPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const [sort, setSort] = useState<tListingSort[]>(feed.query?.sort ?? []);
	const withGeo = !!feed.query?.meta?.latLon;

	return (
		<PatchContainer
			data-ui={"SortPatch[Container]"}
			onCancel={onCancel}
			onSave={() => {
				patchMutation.mutate(
					{
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								sort,
							},
						},
					},
					{
						onSettled,
					},
				);
			}}
			loading={patchMutation.isPending}
			disabled={false}
			{...props}
		>
			<ListingSortSelect
				withGeo={withGeo}
				state={{
					value: sort,
					set: setSort,
				}}
			/>
		</PatchContainer>
	);
};
