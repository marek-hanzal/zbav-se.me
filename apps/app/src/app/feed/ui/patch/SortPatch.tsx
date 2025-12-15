import { Container } from "@use-pico/client/ui/container";
import type { tFeed, tListingSort } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user/feed";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/control/SaveControl";
import { ListingSortSelect } from "~/app/listing/ui/ListingSortSelect";

export namespace SortPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const SortPatch: FC<SortPatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
	const patch = withFeedFetchQuery.useSet();
	const [sort, setSort] = useState<tListingSort[]>(feed.query?.sort ?? []);

	const withGeo = !!feed.query?.meta?.latLon;

	const mutation = withFeedPatchMutation.useMutation({
		onSuccess(feed) {
			patch(() => feed, {
				where: {
					id: feed.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<Container
			data-ui={"SortPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<ListingSortSelect
				withGeo={withGeo}
				state={{
					value: sort,
					set: setSort,
				}}
			/>

			<SaveControl
				onCancel={onCancel}
				onSave={() => {
					mutation.mutate({
						patch: {
							query: {
								...feed.query,
								sort: sort,
							},
						},
						query: {
							where: {
								id: feed.id,
							},
						},
					});
				}}
				loading={mutation.isPending}
				disabled={false}
			/>
		</Container>
	);
};
