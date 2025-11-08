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
				tone: "secondary",
				theme: "dark",
				size: "xl",
				...confirmProps,
				onClick() {
					toast.promise(
						listingIgnoreToggleMutation.mutateAsync({
							toggle: !isIgnored,
							listingId,
						}),
						{
							loading: translator.text("Loading... (toast)"),
							success: translator.text(
								isIgnored
									? "Listing unignored (toast)"
									: "Listing ignored (toast)",
							),
							error: translator.text(
								"Error ignoring listing (toast)",
							),
							id: "listing-ignore-button",
						},
					);
				},
			}}
			round={"full"}
			{...props}
		/>
	);
};
