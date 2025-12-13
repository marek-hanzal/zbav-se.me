import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { tFeed, tFeedPatch } from "@zbav-se.me/sdk/api/user";
import { withFeedPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { type FC, useState } from "react";
import { toast } from "sonner";
import { LocationSelection } from "~/app/location/ui/LocationSelection";

export namespace LocationPatch {
	export interface Props extends Container.Props {
		locale: string;
		feed: tFeed;
		onSettled?(): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ locale, feed, onSettled, ...props }) => {
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
			data-ui={"LocationPatch[Container]"}
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				gap: "default",
			}}
			{...props}
		>
			<LocationSelection
				locale={locale}
				value={patch.patch.locationId}
				onChange={(value) => {
					setChange(true);
					setPatch((prev) => ({
						...prev,
						patch: {
							...prev.patch,
							locationId: value,
						},
					}));
				}}
				onLocation={({ lon, lat }) => {
					setChange(true);
					setPatch((prev) => ({
						patch: {
							...prev.patch,
							query: {
								...prev.patch.query,
								meta: {
									latLon: {
										lon,
										lat,
									},
								},
							},
						},
						query: {
							where: {
								id: feed.id,
							},
						},
					}));
				}}
				textHint={"Feed - location security (hint)"}
				ui={{
					height: "full",
				}}
			/>

			<Button
				label={"Feed - save (button)"}
				loading={mutation.isPending}
				disabled={!change || mutation.isPending}
				onClick={() => {
					toast.promise(mutation.mutateAsync(patch), {
						loading: translator.text("Loading... (toast)"),
						success: translator.text("Feed location updated (toast)"),
						error: translator.text("Error updating feed location (toast)"),
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
