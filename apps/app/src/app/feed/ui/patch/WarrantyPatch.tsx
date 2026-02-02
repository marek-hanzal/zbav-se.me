import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { tListingWarrantyEnum } from "@zbav-se.me/sdk/api/public";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { WarrantySelect } from "~/app/warranty/ui/WarrantySelect";

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
	const patch = withFeedFetchQuery.useSet();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: (feed.query?.filter?.warrantyIn ?? []).map((warranty) => ({
			id: warranty,
		})),
	});

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
			data-ui={"WarrantyPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
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
					mutation.mutate({
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
