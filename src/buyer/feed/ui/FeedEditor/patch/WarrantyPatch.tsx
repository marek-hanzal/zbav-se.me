import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useSelection } from "@/lib/client/selection";
import type { EntitySchema } from "@/lib/common/schema";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/buyer/feed/server/schema/FeedSchema";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import type { WarrantyEnumSchema } from "~/common/warranty/enum/WarrantyEnumSchema";
import { WarrantySelect } from "~/common/warranty/ui/WarrantySelect";

export namespace WarrantyPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation({
		onSettled,
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
									warrantyIn:
										selection.optional.multiId() as WarrantyEnumSchema.Type[],
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
