import { useQueryClient } from "@tanstack/react-query";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withListingFlagToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingFetchQuery, withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { toast } from "sonner";

export namespace ListingFlagButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
	}
}

export const ListingFlagButton: FC<ListingFlagButton.Props> = ({
	listingId,
	buttonProps,
	confirmProps,
	onReset,
	disabled = false,
	ui,
	...props
}) => {
	const queryClient = useQueryClient();
	const listingFlagToggleMutation = withListingFlagToggleMutation.useMutation({
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
					disabled
					loading
					ui={{
						tone: "primary",
						theme: "light",
						size: "xl",
						justify: "start",
						...ui,
					}}
					{...props}
				/>
			}
		>
			{({ data: listing }) => {
				return (
					<ConfirmButton
						iconEnabled={FlagIcon}
						loading={listingFlagToggleMutation.isPending}
						disabled={listing.isFavourite || listing.isIgnored || disabled}
						label={
							listing.hasFlag ? "Unflag listing (button)" : "Flag listing (button)"
						}
						buttonProps={{
							...buttonProps,
							onClick(event) {
								if (listing.hasFlag) {
									toast.info(
										translator.text("Second tap to unflag listing (toast)"),
										{
											id: "listing-flag-button",
										},
									);
								}

								if (!listing.hasFlag) {
									toast.warning(
										translator.text("Second tap to flag listing (toast)"),
										{
											id: "listing-flag-button",
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
									listingFlagToggleMutation.mutateAsync({
										toggle: !listing.hasFlag,
										listingId: listing.id,
									}),
									{
										loading: translator.text("Loading... (toast)"),
										success: translator.text(
											listing.hasFlag
												? "Listing unflagged (toast)"
												: "Listing flagged (toast)",
										),
										error: translator.text("Error flagging listing (toast)"),
										id: "listing-flag-button",
									},
								);
								confirmProps?.onClick?.(e);
							},
						}}
						onReset={() => {
							toast.dismiss("listing-flag-button");
							onReset?.();
						}}
						ui={{
							tone: "primary",
							theme: listing.hasFlag ? "dark" : "light",
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
