import { Container } from "@use-pico/client/ui/container";
import { type FC, useState } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import type { ListingSortSchema } from "~/buyer/listing/server/schema/ListingSortSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { ListingSortSelect } from "./ListingSortSelect";

export namespace SortPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const SortPatch: FC<SortPatch.Props> = ({ feed, onSettled, onCancel, ui, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const [sort, setSort] = useState<ListingSortSchema.Type[]>(feed.query?.sort ?? []);
	const withGeo = !!feed.query?.meta?.latLon;

	return (
		<Container
			data-ui={"SortPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				inner: "default",
				gap: "default",
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

			<SaveContainer
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
			/>
		</Container>
	);
};
