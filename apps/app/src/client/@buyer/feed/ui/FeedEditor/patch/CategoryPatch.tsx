import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { EntitySchema } from "@use-pico/common/schema";
import type { FC } from "react";
import { withFeedQuery } from "~/client/@buyer/feed/query/withFeedQuery";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { CategorySelect } from "~/client/@session/category/ui/CategorySelect";
import type { FeedSchema } from "~/server/@buyer/feed/schema/FeedSchema";

export namespace CategoryPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const CategoryPatch: FC<CategoryPatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	ui,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const selection = useSelection<EntitySchema.Type>({
		mode: "multi",
		initial: feed.query?.filter?.categoryIdIn?.map((id) => ({
			id,
		})),
	});

	const categoryId = selection.optional.singleId() ?? null;

	return (
		<Container
			data-ui={"CategoryPatch[Container]"}
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
			<CategorySelect
				selection={selection}
				categoryId={categoryId ?? undefined}
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
									filter: {
										...feed.query?.filter,
										categoryIdIn: selection.optional.multiId(),
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
