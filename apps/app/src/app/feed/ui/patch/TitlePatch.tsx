import type { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import type { FC } from "react";
import { TitleInput } from "~/app/feed/ui/input/TitleInput";

export namespace TitlePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const mutation = withFeedPatchMutation.useMutation({
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<TitleInput
			defaultValue={feed.query?.filter?.title ?? ""}
			onCancel={onCancel}
			loading={mutation.isPending}
			onSave={(title) => {
				mutation.mutate({
					patch: {
						query: {
							...feed.query,
							filter: {
								...feed.query?.filter,
								title,
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
			{...props}
		/>
	);
};
