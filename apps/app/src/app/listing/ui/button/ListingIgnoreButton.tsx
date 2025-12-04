import { usePatchCollection } from "@use-pico/client/hook";
import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import type { tListing, tListingCollection, tListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingCollectionQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import { toast } from "sonner";

export namespace ListingIgnoreButton {
	export interface Props extends ConfirmButton.Props {
		listing: tListing;
		query: tListingQuery;
		onSuccess?(toggle: boolean): void;
	}
}

export const ListingIgnoreButton: FC<ListingIgnoreButton.Props> = ({
	listing,
	query,
	onSuccess,
	confirmProps,
	buttonProps,
	onReset,
	disabled = false,
	...props
}) => {
	const setListingCollection = withListingCollectionQuery.useSet();

	const patch = usePatchCollection<tListingCollection>(listing);

	const listingIgnoreToggleMutation = withListingIgnoreToggleMutation.useMutation({
		onSuccess() {
			onSuccess?.(!listing.isIgnored);
			setListingCollection(
				patch({
					id: listing.id,
					isIgnored: !listing.isIgnored,
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
			iconEnabled={TrashIcon}
			tone={listing.isIgnored ? "secondary" : "primary"}
			theme={"light"}
			loading={listingIgnoreToggleMutation.isPending}
			disabled={listing.isInCart || disabled}
			label={listing.isIgnored ? "Unignore listing (button)" : "Ignore listing (button)"}
			size={"xl"}
			buttonProps={{
				...buttonProps,
				onClick(event) {
					if (listing.isIgnored) {
						toast.info(translator.text("Second tap to unignore listing (toast)"), {
							id: "listing-ignore-button",
						});
					}

					if (!listing.isIgnored) {
						toast.info(translator.text("Second tap to ignore listing (toast)"), {
							id: "listing-ignore-button",
						});
					}

					buttonProps?.onClick?.(event);
				},
			}}
			confirmProps={{
				tone: "secondary",
				theme: "dark",
				...confirmProps,
				onClick(e) {
					toast.promise(
						listingIgnoreToggleMutation.mutateAsync({
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
							id: "listing-ignore-button",
						},
					);
					confirmProps?.onClick?.(e);
				},
			}}
			onReset={() => {
				toast.dismiss("listing-ignore-button");
				onReset?.();
			}}
			menu
			{...props}
		/>
	);
};
