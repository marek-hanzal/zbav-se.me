import { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { ConditionSelect } from "~/app/@common/condition/ui/ConditionSelect";
import { PatchContainer } from "~/app/@common/container/ui/PatchContainer";

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
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});
	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.conditionIn?.map((item) => ({
			id: String(item),
		})),
	});

	return (
		<PatchContainer
			data-ui={"ConditionPatch[Container]"}
			ui={ui}
			onCancel={onCancel}
			onSave={() => {
				patch({
					query: {
						...feed.query,
						filter: {
							...feed.query?.filter,
							conditionIn: selection.optional
								.multiId()
								.map((id) => Number.parseInt(id, 10)),
						},
					},
				});
			}}
			loading={isPending}
			disabled={false}
			{...props}
		>
			<ConditionSelect
				selection={selection}
				allowClear
			/>
		</PatchContainer>
	);
};
