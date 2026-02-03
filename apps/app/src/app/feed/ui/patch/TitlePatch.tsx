import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/buyer-user/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { TextInputContainer } from "~/app/@common/input/ui/TextInputContainer";

export namespace TitlePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const patch = withFeedFetchQuery.useSet();
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
		<TextInputContainer
			data-ui={"TitlePatch[TextInputContainer]"}
			textTitle={translator.text("Feed title (title)")}
			placeholder={translator.text("Feed title (placeholder)")}
			hint={translator.text("Feed title (hint)")}
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
