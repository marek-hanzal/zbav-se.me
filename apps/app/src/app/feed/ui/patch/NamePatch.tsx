import type { Container } from "@use-pico/client/ui/container";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import type { FC } from "react";
import { NameInput } from "~/app/feed/ui/input/NameInput";

export namespace NamePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const NamePatch: FC<NamePatch.Props> = ({ feed, onSettled, onCancel, ...props }) => {
	const mutation = withFeedPatchMutation.useMutation({
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<NameInput
			onSave={(name) => {
				mutation.mutate({
					patch: {
						name,
					},
					query: {
						where: {
							id: feed.id,
						},
					},
				});
			}}
			onCancel={onCancel}
			defaultValue={feed.name ?? ""}
			loading={mutation.isPending}
			{...props}
		/>
	);
};
