import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { withFeedQuery } from "~/@buyer/feed/query/withFeedQuery";
import type { FeedSchema } from "~/@buyer/feed/server/schema/FeedSchema";
import { ConditionSelect } from "~/@common/condition/ui/ConditionSelect";
import { SaveContainer } from "~/@common/container/ui/SaveContainer";

export namespace ConditionPatch {
	export interface Props extends Container.Props {
		feed: FeedSchema.Type;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const ConditionPatch: FC<ConditionPatch.Props> = ({
	feed,
	onSettled,
	onCancel,
	ui,
	...props
}) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.conditionIn?.map((item) => ({
			id: String(item),
		})),
	});

	return (
		<Container
			data-ui={"ConditionPatch[Container]"}
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
			<ConditionSelect
				selection={selection}
				allowClear
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
										conditionIn: selection.optional
											.multiId()
											.map((id) => Number.parseInt(id, 10)),
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
