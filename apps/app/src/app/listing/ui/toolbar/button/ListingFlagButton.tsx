import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withListingFlagToggleMutation } from "@zbav-se.me/sdk/mutation/session";
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
	buttonProps,
	confirmProps,
	onReset,
	...props
}) => {
	const listingFlagToggleMutation = withListingFlagToggleMutation.useMutation(
		{
			onSuccess() {
				onSuccess(!hasFlag);
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
				tone: "secondary",
				theme: "dark",
				size: "xl",
				...confirmProps,
				onClick(e) {
					toast.promise(
						listingFlagToggleMutation.mutateAsync({
							toggle: !hasFlag,
							listingId,
						}),
						{
							loading: translator.text("Loading... (toast)"),
							success: translator.text(
								hasFlag
									? "Listing unflagged (toast)"
									: "Listing flagged (toast)",
							),
							error: translator.text(
								"Error flagging listing (toast)",
							),
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
