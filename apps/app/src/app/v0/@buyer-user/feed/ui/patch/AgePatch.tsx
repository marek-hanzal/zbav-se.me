import { useSelection } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/v0/@common/age/ui/AgeSelection";
import { PatchContainer } from "~/app/v0/@common/container/ui/PatchContainer";

export namespace AgePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ feed, onSettled, ...props }) => {
	const patchMutation = withFeedQuery.usePatchMutation();
	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.ageIn?.map((item) => ({
			id: String(item),
		})),
	});

	return (
		<PatchContainer
			data-ui={"AgePatch[Container]"}
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
									ageIn: selection.optional
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
			{...props}
		>
			<AgeSelection
				selection={selection}
				allowClear
			/>
		</PatchContainer>
	);
};
