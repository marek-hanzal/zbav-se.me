import { TrashIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation/buyer-user/ignore";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import type { FC } from "react";

export namespace IgnoreButton {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const IgnoreButton: FC<IgnoreButton.Props> = ({
	_suspense,
	listingId,
	confirmProps,
	onReset,
	disabled = false,
	ui,
	...props
}) => {
	const patch = withListingFetchQuery.useSet();
	const { data: listing } = withListingFetchQuery.useSuspenseQuery({
		where: {
			id: listingId,
		},
	});
	const ignoreToggleMutation = withIgnoreToggleMutation.useMutation({
		onSuccess(listing) {
			patch(() => listing, {
				where: {
					id: listingId,
				},
			});
		},
		meta: {
			mutationId: listingId,
		},
	});

	return (
		<ConfirmButton
			iconEnabled={TrashIcon}
			iconProps={{
				ui: {
					text: "xl",
				},
			}}
			loading={ignoreToggleMutation.isPending}
			disabled={listing.isFavourite || disabled}
			label={translator.text(
				listing.isIgnored ? "Unignore listing (button)" : "Ignore listing (button)",
			)}
			confirmProps={{
				ui: {
					tone: "warning",
					theme: "light",
				},
				label: translator.text("Ignore listing - confirm (button)"),
				...confirmProps,
				onClick(e) {
					ignoreToggleMutation.mutate({
						toggle: !listing.isIgnored,
						listingId: listing.id,
					});
					confirmProps?.onClick?.(e);
				},
			}}
			onReset={onReset}
			ui={{
				tone: listing.isIgnored ? "primary" : "neutral",
				theme: "light",
				size: "default",
				justify: "start",
				...ui,
			}}
			{...props}
		/>
	);
};
