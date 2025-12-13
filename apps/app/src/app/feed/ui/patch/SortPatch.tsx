import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { ListingSortSelect } from "~/app/listing/ui/ListingSortSelect";

export namespace SortPatch {
	export interface Props extends Container.Props {
		feed: tFeed;
		onSettled?(): void;
	}
}

export const SortPatch: FC<SortPatch.Props> = ({ feed, onSettled, ...props }) => {
	const [change, setChange] = useState(false);

	const [patch, setPatch] = useState<tFeedPatch>({
		patch: feed,
		query: {
			where: {
				id: feed.id,
			},
		},
	});

	const withGeo = !!feed.query?.meta?.latLon;

	const mutation = withFeedPatchMutation.useMutation({
		onSettled() {
			setChange(false);
			onSettled?.();
		},
	});

	return (
		<Container
			data-ui={"SortPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
			}}
			{...props}
		>
			<ListingSortSelect
				withGeo={withGeo}
				state={{
					value: patch.patch.query?.sort ?? [],
					set(value) {
						setChange(true);
						setPatch((prev) => ({
							...prev,
							patch: {
								...prev.patch,
								query: {
									...prev.patch.query,
									sort: value,
								},
							},
						}));
					},
				}}
			/>

			<Button
				label={"Feed - save (button)"}
				loading={mutation.isPending}
				disabled={!change || mutation.isPending}
				onClick={() => {
					toast.promise(mutation.mutateAsync(patch), {
						loading: translator.text("Loading... (toast)"),
						success: translator.text("Feed sorting updated (toast)"),
						error: translator.text("Error updating feed sorting (toast)"),
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
