import { TrashIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation/buyer/ignore";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import type { FC } from "react";

export namespace Data {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	listingId,
	confirmProps,
	onReset,
	disabled = false,
	ui,
	...props
}) => {
	const update = withListingQuery.useUpdate();
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const ignoreToggleMutation = withIgnoreToggleMutation.useMutation({
		onSuccess: update,
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
			confirmProps={{
				ui: {
					tone: "warning",
					theme: "light",
				},
				children: <Tx label="Ignore listing - confirm (button)" />,
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
				round: undefined,
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Tx
				label={listing.isIgnored ? "Unignore listing (button)" : "Ignore listing (button)"}
			/>
		</ConfirmButton>
	);
};
