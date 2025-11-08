import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withListingIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation";
import { CancelIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { toast } from "sonner";

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
	buttonProps,
	onReset,
	...props
}) => {
	const listingIgnoreToggleMutation =
		withListingIgnoreToggleMutation.useMutation({
			onSuccess() {
				onSuccess(!isIgnored);
				toast.success(
					translator.text(
						isIgnored
							? "Listing unignored (toast)"
							: "Listing ignored (toast)",
					),
				);
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
			buttonProps={{
				...buttonProps,
				onClick(event) {
					if (isIgnored) {
						toast.info(
							translator.text(
								"Second tap to unignore listing (toast)",
							),
							{
								id: "listing-ignore-button",
							},
						);
					}

					if (!isIgnored) {
						toast.info(
							translator.text(
								"Second tap to ignore listing (toast)",
							),
							{
								id: "listing-ignore-button",
							},
						);
					}

					buttonProps?.onClick?.(event);
				},
			}}
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
			onReset={() => {
				onReset?.();
				toast.dismiss("listing-ignore-button");
			}}
			round={"full"}
			{...props}
		/>
	);
};
