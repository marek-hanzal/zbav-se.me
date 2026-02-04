import type { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { sFeedCreate, type tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import type { FC } from "react";
import { useFeedPatch } from "~/app/@buyer-user/feed/hook/useFeedPatch";
import { TextInputContainer } from "~/app/@common/input/ui/TextInputContainer";

export namespace NamePatch {
	export interface Props extends Omit<Container.Props, "defaultValue"> {
		feed: tFeed;
		onSettled?(): void;
		onCancel(): void;
	}
}

export const NamePatch: FC<NamePatch.Props> = ({ feed, onSettled, ...props }) => {
	const { patch, isPending } = useFeedPatch({
		feed,
		onSettled,
	});

	return (
		<TextInputContainer
			data-ui={"NamePatch[TextInputContainer]"}
			textTitle={translator.text("Feed name (title)")}
			placeholder={translator.text("Feed name (placeholder)")}
			hint={translator.text("Feed name (required)")}
			minLength={sFeedCreate.properties.name.minLength}
			onSave={(name) => {
				patch({
					name,
				});
			}}
			defaultValue={feed.name ?? ""}
			loading={isPending}
			{...props}
		/>
	);
};
