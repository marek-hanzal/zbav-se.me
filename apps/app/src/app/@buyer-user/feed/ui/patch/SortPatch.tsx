import type { Container } from "@use-pico/client/ui/container";
import type { tFeed, tListingSort } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, useState } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { ListingSortSelect } from "~/app/@buyer-user/listing/ui/ListingSortSelect";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";

export namespace SortPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const SortPatch: FC<SortPatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});
	const [sort, setSort] = useState<tListingSort[]>(feed.query?.sort ?? []);
	const withGeo = !!feed.query?.meta?.latLon;

	return (
		<PatchContainer
			data-ui={"SortPatch[Container]"}
			ui={ui}
			onCancel={onCancel}
			onSave={() => {
				patch({
					query: {
						...feed.query,
						sort,
					},
				});
			}}
			loading={isPending}
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
