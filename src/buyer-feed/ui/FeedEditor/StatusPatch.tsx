import type { FC } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import type { ListingStatusEnumSchema } from "~/listing/schema/ListingStatusEnumSchema";
import { ListingStatusSelect } from "~/listing/ui/ListingStatusSelect";
import { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";

export namespace StatusPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancelFn(): void;
		onSettledFn?(): void;
	}
}

export const StatusPatch: FC<StatusPatch.Props> = ({ feed, onSettledFn, onCancelFn, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
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
				onCancelFn={onCancelFn}
				onSaveFn={() => {
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
										selection.optional.multiIdFn() as ListingStatusEnumSchema.Type[],
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
