import { usePatchCollection } from "@use-pico/client/hook";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tListing, tListingCollection, tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingFlagToggleMutation } from "@zbav-se.me/sdk/mutation/session";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { toast } from "sonner";

export namespace ListingFlagButton {
	export interface Props extends ConfirmButton.Props {
		listing: tListing;
		query: tListingQuery | undefined;
		onSuccess?(toggle: boolean): void;
	}
}

export const ListingFlagButton: FC<ListingFlagButton.Props> = ({
	listing,
	query,
	onSuccess,
	buttonProps,
	confirmProps,
	onReset,
	disabled = false,
	...props
}) => {
	const setListingCollection = withListingCollectionQuery.useSet();

	const patch = usePatchCollection<tListingCollection>(listing);

	const listingFlagToggleMutation = withListingFlagToggleMutation.useMutation({
		onSuccess() {
			onSuccess?.(!listing.hasFlag);
			setListingCollection(
				patch({
					id: listing.id,
					hasFlag: !listing.hasFlag,
				}),
				query,
			);
		},
		meta: {
			mutationId: listing.id,
		},
	});

	return (
		<ConfirmButton
			iconEnabled={FlagIcon}
			tone={"primary"}
			theme={listing.hasFlag ? "dark" : "light"}
			loading={listingFlagToggleMutation.isPending}
			disabled={listing.isInCart || listing.isIgnored || disabled}
			buttonProps={{
				...buttonProps,
				onClick(event) {
					if (listing.hasFlag) {
						toast.info(translator.text("Second tap to unflag listing (toast)"), {
							id: "listing-flag-button",
						});
					}

					if (!listing.hasFlag) {
						toast.warning(translator.text("Second tap to flag listing (toast)"), {
							id: "listing-flag-button",
						});
					}

					buttonProps?.onClick?.(event);
				},
			}}
			confirmProps={{
				tone: "secondary",
				theme: "dark",
				size: "xl",
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
								listing.hasFlag ? "Listing unflagged (toast)" : "Listing flagged (toast)",
							),
							error: translator.text("Error flagging listing (toast)"),
							id: "listing-flag-button",
						},
					);
					confirmProps?.onClick?.(e);
				},
			}}
			round={"full"}
			onReset={() => {
				toast.dismiss("listing-flag-button");
				onReset?.();
			}}
			{...props}
		/>
	);
};
