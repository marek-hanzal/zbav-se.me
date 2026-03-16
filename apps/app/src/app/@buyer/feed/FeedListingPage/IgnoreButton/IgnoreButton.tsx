import { TrashIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { withIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation/buyer/ignore";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";

export namespace IgnoreButton {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const IgnoreButton = withFallback(
	({
		_suspense,
		listingId,
		confirmProps,
		onReset,
		disabled = false,
		ui,
		...props
	}: IgnoreButton.Props) => {
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
				data-ui={"IgnoreButton"}
				data-action={listing.isIgnored ? "unignore listing" : "ignore listing"}
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
					label={
						listing.isIgnored ? "Unignore listing (button)" : "Ignore listing (button)"
					}
				/>
			</ConfirmButton>
		);
	},
	({ ui, ...props }: Omit<IgnoreButton.Props, "_suspense">) => {
		return (
			<ConfirmButton
				loading
				ui={{
					round: undefined,
					border: false,
					shadow: false,
					width: "full",
					...ui,
				}}
				{...props}
			>
				<Tx label="Loading... (button)" />
			</ConfirmButton>
		);
	},
);
