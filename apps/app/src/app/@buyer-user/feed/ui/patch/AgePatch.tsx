import { useSelection } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { Rating } from "@zbav-se.me/ui/rating";
import type { FC } from "react";
import { AgeSelection } from "~/app/@common/age/ui/AgeSelection";
import { SaveControl } from "~/app/@common/control/SaveControl";

export namespace AgePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const AgePatch: FC<AgePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patch = withFeedFetchQuery.useSet();
	const selection = useSelection<Rating.RatingItem>({
		mode: "multi",
		initial: feed.query?.filter?.ageIn?.map((item) => ({
			id: String(item),
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
			data-ui={"AgePatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
				inner: "default",
			}}
			{...props}
		>
			<AgeSelection
				selection={selection}
				allowClear
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
									ageIn: selection.optional
										.multiId()
										.map((id) => Number.parseInt(id, 10)),
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
