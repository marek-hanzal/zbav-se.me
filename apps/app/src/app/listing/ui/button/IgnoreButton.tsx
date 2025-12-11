import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingFetchQuery, withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { toast } from "sonner";

export namespace IgnoreButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
	}
}

export const IgnoreButton: FC<IgnoreButton.Props> = ({
	listingId,
	confirmProps,
	buttonProps,
	onReset,
	disabled = false,
	ui,
	...props
}) => {
	const queryClient = useQueryClient();
	const ignoreToggleMutation = withIgnoreToggleMutation.useMutation({
		onSuccess() {
			withListingFetchQuery.invalidate(queryClient, {
				where: {
					id: listingId,
				},
			});
			withListingMetricsFetchQuery.invalidate(queryClient, listingId);
		},
		meta: {
			mutationId: listingId,
		},
	});

	return (
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={
				<ConfirmButton
					label={"Loading... (button)"}
					loading
					{...props}
				/>
			}
		>
			{({ data: listing }) => {
				return (
					<ConfirmButton
						iconEnabled={TrashIcon}
						loading={ignoreToggleMutation.isPending}
						disabled={listing.isFavourite || disabled}
						label={
							listing.isIgnored
								? "Unignore listing (button)"
								: "Ignore listing (button)"
						}
						buttonProps={{
							...buttonProps,
							onClick(event) {
								if (listing.isIgnored) {
									toast.info(
										translator.text("Second tap to unignore listing (toast)"),
										{
											id: "ignore-button",
										},
									);
								}

								if (!listing.isIgnored) {
									toast.info(
										translator.text("Second tap to ignore listing (toast)"),
										{
											id: "ignore-button",
										},
									);
								}

								buttonProps?.onClick?.(event);
							},
						}}
						confirmProps={{
							ui: {
								tone: "secondary",
								theme: "dark",
							},
							...confirmProps,
							onClick(e) {
								toast.promise(
									ignoreToggleMutation.mutateAsync({
										toggle: !listing.isIgnored,
										listingId: listing.id,
									}),
									{
										loading: translator.text("Loading... (toast)"),
										success: translator.text(
											listing.isIgnored
												? "Listing unignored (toast)"
												: "Listing ignored (toast)",
										),
										error: translator.text("Error ignoring listing (toast)"),
										id: "ignore-button",
									},
								);
								confirmProps?.onClick?.(e);
							},
						}}
						onReset={() => {
							toast.dismiss("ignore-button");
							onReset?.();
						}}
						ui={{
							tone: listing.isIgnored ? "secondary" : "primary",
							theme: "light",
							size: "xl",
							justify: "start",
							...ui,
						}}
						{...props}
					/>
				);
			}}
		</withListingFetchQuery.Suspense>
	);
};
