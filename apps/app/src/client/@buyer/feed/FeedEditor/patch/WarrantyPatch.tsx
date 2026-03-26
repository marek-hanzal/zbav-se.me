import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { FC } from "react";
import { withFeedQuery } from "~/client/@buyer/feed/withFeedQuery";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { WarrantySelect } from "~/client/@common/warranty/ui/WarrantySelect";
import type { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";
import type { ListingWarrantyEnumSchema } from "~/server/database/@enum/ListingWarrantyEnumSchema";

export namespace WarrantyPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const WarrantyPatch: FC<WarrantyPatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	ui,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.warrantyIn ?? []).map((warranty) => ({
			id: warranty,
		})),
	});

	return (
		<Container
			data-ui={"WarrantyPatch[Container]"}
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
			<WarrantySelect selection={selection} />

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
									filter: {
										...feed.query?.filter,
										warrantyIn:
											selection.optional.multiId() as ListingWarrantyEnumSchema.Type[],
									},
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
