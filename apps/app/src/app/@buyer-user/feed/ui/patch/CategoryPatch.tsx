import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { CategorySelect } from "~/app/@common/category/ui/CategorySelect";
import { SaveControl } from "~/app/@common/control/SaveControl";

export namespace CategoryPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patch = withFeedFetchQuery.useSet();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: feed.query?.filter?.categoryIdIn?.map((id) => ({
			id,
		})),
	});

	const categoryId = selection.optional.singleId() ?? null;

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
			data-ui={"CategoryPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				gap: "default",
				inner: "default",
			}}
			{...props}
		>
			<CategorySelect
				selection={selection}
				categoryId={categoryId ?? undefined}
			/>

			<SaveControl
				onCancel={onCancel}
				onSave={() => {
					mutation.mutate({
						patch: {
							query: {
								...feed.query,
								filter: {
									...feed.query?.filter,
									categoryIdIn: selection.optional.multiId(),
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
