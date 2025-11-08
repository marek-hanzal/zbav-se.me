import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withListingFlagToggleMutation } from "@zbav-se.me/sdk/mutation";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { toast } from "sonner";

export namespace ListingFlagButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
		hasFlag: boolean;
		onSuccess(toggle: boolean): void;
	}
}

export const ListingFlagButton: FC<ListingFlagButton.Props> = ({
	listingId,
	hasFlag,
	onSuccess,
	confirmProps,
	buttonProps,
	onReset,
	...props
}) => {
	const listingFlagToggleMutation = withListingFlagToggleMutation.useMutation(
		{
			onSuccess() {
				onSuccess(!hasFlag);
				toast.success(
					translator.text(
						hasFlag
							? "Listing unflagged (toast)"
							: "Listing flagged (toast)",
					),
				);
			},
			meta: {
				mutationId: listingId,
			},
		},
	);

	return (
		<ConfirmButton
			iconEnabled={FlagIcon}
			tone={"primary"}
			theme={hasFlag ? "dark" : "light"}
			loading={listingFlagToggleMutation.isPending}
			buttonProps={{
				...buttonProps,
				onClick(event) {
					if (hasFlag) {
						toast.info(
							translator.text(
								"Second tap to unflag listing (toast)",
							),
							{
								id: "listing-flag-button",
							},
						);
					}

					if (!hasFlag) {
						toast.warning(
							translator.text(
								"Second tap to flag listing (toast)",
							),
							{
								id: "listing-flag-button",
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
					toast.dismiss("listing-flag-button");
					listingFlagToggleMutation.mutate({
						toggle: !hasFlag,
						listingId,
					});
				},
			}}
			onReset={() => {
				onReset?.();
				toast.dismiss("listing-flag-button");
			}}
			round={"full"}
			{...props}
		/>
	);
};
