import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace ListingIgnoreButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
		isIgnored: boolean;
		onSuccess(toggle: boolean): void;
	}
}

export const ListingIgnoreButton: FC<ListingIgnoreButton.Props> = ({
	listingId,
	isIgnored,
	onSuccess,
	confirmProps,
	...props
}) => {
	const listingIgnoreToggleMutation =
		withListingIgnoreToggleMutation.useMutation({
			onSuccess() {
				onSuccess(!isIgnored);
			},
			meta: {
				mutationId: listingId,
			},
		});

	return (
		<ConfirmButton
			iconEnabled={CancelIcon}
			tone={"primary"}
			theme={isIgnored ? "dark" : "light"}
			loading={listingIgnoreToggleMutation.isPending}
			confirmProps={{
				tone: confirmProps?.tone ?? "secondary",
				theme: confirmProps?.theme ?? "dark",
				size: confirmProps?.size ?? "lg",
				onClick() {
					listingIgnoreToggleMutation.mutate({
						toggle: !isIgnored,
						listingId,
					});
				},
			}}
			round={"full"}
			{...props}
		/>
	);
};
