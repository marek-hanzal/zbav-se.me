import type { FC } from "react";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer-feed/schema/FeedSchema";
import { SaveContainer } from "~/container/ui/SaveContainer";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { useSelection } from "~/selection/hook/useSelection";
import { Container } from "~/ui/ui/Container";
import type { WarrantyEnumSchema } from "~/warranty/schema/WarrantyEnumSchema";
import { WarrantySelect } from "~/warranty/ui/WarrantySelect";

export namespace WarrantyPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancelFn(): void;
		onSettledFn?(): void;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({
	feed,
	onSettledFn,
	onCancelFn,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled: onSettledFn,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.where?.warrantyIn ?? []).map((warranty) => ({
			id: warranty,
		})),
		deps: [
			feed,
		],
	});

	return (
		<Container
			data-ui={"WarrantyPatch"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<WarrantySelect selection={selection} />

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
									warrantyIn:
										selection.optional.multiIdFn() as WarrantyEnumSchema.Type[],
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
