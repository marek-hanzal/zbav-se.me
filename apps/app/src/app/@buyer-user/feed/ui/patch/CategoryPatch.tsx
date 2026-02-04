import { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";
import { CategorySelect } from "~/app/@session/category/ui/CategorySelect";

export namespace CategoryPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: feed.query?.filter?.categoryIdIn?.map((id) => ({
			id,
		})),
	});

	const categoryId = selection.optional.singleId() ?? null;

	return (
		<PatchContainer
			data-ui={"CategoryPatch[Container]"}
			onCancel={onCancel}
			onSave={() => {
				patch({
					query: {
						...feed.query,
						filter: {
							...feed.query?.filter,
							categoryIdIn: selection.optional.multiId(),
						},
					},
				});
			}}
			loading={isPending}
			disabled={false}
			{...props}
		>
			<CategorySelect
				selection={selection}
				categoryId={categoryId ?? undefined}
			/>
		</PatchContainer>
	);
};
