import { ConfirmButton } from "@use-pico/client/ui/button";
import { withListingFlagToggleMutation } from "@zbav-se.me/sdk/mutation";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

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
			confirmProps={{
				tone: confirmProps?.tone ?? "secondary",
				theme: confirmProps?.theme ?? "dark",
				size: confirmProps?.size ?? "lg",
				onClick() {
					listingFlagToggleMutation.mutate({
						toggle: !hasFlag,
						listingId,
					});
				},
			}}
			round={"full"}
			{...props}
		/>
	);
};
