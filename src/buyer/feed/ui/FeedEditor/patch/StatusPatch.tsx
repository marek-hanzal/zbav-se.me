import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { ListingStatusEnumSchema } from "~/common/listing/enum/ListingStatusEnumSchema";
import { ListingStatusSelect } from "~/common/listing/ui/ListingStatusSelect";

export namespace StatusPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const StatusPatch: FC<StatusPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
	});
	const statusIn = feed.query?.where?.statusIn ?? [];
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: statusIn.map((status) => ({
			id: status,
		})),
		deps: [
			feed,
		],
	});

	return (
		<Container
			data-ui={"StatusPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<ListingStatusSelect selection={selection} />

			<SaveContainer
				onCancel={onCancel}
				onSave={() => {
					patchMutation.mutate({
						query: {
							where: {
								id: feed.id,
							},
						},
						patch: {
							query: {
								...feed.query,
								where: {
									...feed.query?.where,
									statusIn:
										selection.optional.multiId() as ListingStatusEnumSchema.Type[],
								},
							},
						},
					});
				}}
				loading={patchMutation.isPending}
				disabled={patchMutation.isPending}
			/>
		</Container>
	);
};
