import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed, tListingWarrantyEnum } from "@zbav-se.me/sdk/api/buyer";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { WarrantySelect } from "~/app/@common/warranty/ui/WarrantySelect";

export namespace WarrantyPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
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
											selection.optional.multiId() as tListingWarrantyEnum[],
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
