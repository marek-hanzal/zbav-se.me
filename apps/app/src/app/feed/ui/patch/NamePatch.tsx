import { SaveIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { uiSaveButton } from "@zbav-se.me/ui/ui";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { NameInput } from "~/app/feed/ui/input/NameInput";

export namespace NamePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
	}
}

export const NamePatch: FC<NamePatch.Props> = ({ feed, onSettled, ...props }) => {
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<tFeedPatch>({
		patch: feed,
		query: {
			where: {
				id: feed.id,
			},
		},
	});

	const mutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			onSettled?.();
		},
	});

	return (
		<Container
			data-ui={"NamePatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
				inner: "4xl",
			}}
			{...props}
		>
			<NameInput
				ui={{
					height: "full",
				}}
				value={patch.patch.name ?? ""}
				onChange={(name) => {
					setChange(true);
					setPatch((prev) => ({
						...prev,
						patch: {
							...prev.patch,
							name,
						},
					}));
				}}
				onSubmit={() => {
					toast.promise(mutation.mutateAsync(patch), {
						loading: translator.text("Loading... (toast)"),
						success: translator.text("Feed name updated (toast)"),
						error: translator.text("Error updating feed name (toast)"),
					});
				}}
			/>

			<Button
				label={"Feed - save (button)"}
				loading={mutation.isPending}
				disabled={!change || mutation.isPending}
				iconEnabled={SaveIcon}
				iconProps={{
					ui: {
						text: "2xl",
					},
				}}
				onClick={() => {
					mutation.mutate(patch);
				}}
				{...uiSaveButton({
					className: [],
				})}
			/>
		</Container>
	);
};
