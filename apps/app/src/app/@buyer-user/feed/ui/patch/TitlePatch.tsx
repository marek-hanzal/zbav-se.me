import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { TextInputContainer } from "~/app/@common/input/ui/TextInputContainer";

export namespace TitlePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ feed, onSettled, ...props }) => {
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});

	return (
		<TextInputContainer
			data-ui={"TitlePatch[TextInputContainer]"}
			textTitle={translator.text("Feed title (title)")}
			placeholder={translator.text("Feed title (placeholder)")}
			hint={translator.text("Feed title (hint)")}
			defaultValue={feed.query?.filter?.title ?? ""}
			loading={isPending}
			onSave={(title) => {
				patch({
					query: {
						...feed.query,
						filter: {
							...feed.query?.filter,
							title,
						},
					},
				});
			}}
			{...props}
		/>
	);
};
