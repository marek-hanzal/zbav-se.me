import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { TitleInput } from "~/app/feed/ui/input/TitleInput";

export namespace TitlePatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
	}
}

export const TitlePatch: FC<TitlePatch.Props> = ({ feed, onSettled, ...props }) => {
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
			data-ui={"TitlePatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
			}}
			{...props}
		>
			<TitleInput
				value={patch.patch.query?.filter?.title ?? ""}
				ui={{
					height: "full",
				}}
				onChange={(title) => {
					setChange(true);
					setPatch((prev) => ({
						...prev,
						patch: {
							...prev.patch,
							query: {
								...prev.patch.query,
								filter: {
									...prev.patch.query?.filter,
									title,
								},
							},
						},
					}));
				}}
			/>

			<Button
				label={"Feed - save (button)"}
				loading={mutation.isPending}
				disabled={!change || mutation.isPending}
				onClick={() => {
					toast.promise(mutation.mutateAsync(patch), {
						loading: translator.text("Loading... (toast)"),
						success: translator.text("Feed title updated (toast)"),
						error: translator.text("Error updating feed title (toast)"),
					});
				}}
				ui={{
					tone: "secondary",
					theme: "dark",
					size: "xl",
				}}
			/>
		</Container>
	);
};
