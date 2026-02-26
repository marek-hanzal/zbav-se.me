import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { ConditionSelect } from "~/app/v0/@common/condition/ui/ConditionSelect";

export namespace ConditionPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
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
