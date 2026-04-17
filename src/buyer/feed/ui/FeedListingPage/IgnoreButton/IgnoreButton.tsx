import { ConfirmButton } from "@/lib/client/button";
import { withFallback } from "@/lib/client/fallback";
import { TrashIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withIgnoreToggleMutation } from "~/buyer/ignore/mutation/withIgnoreToggleMutation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";

export namespace IgnoreButton {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const IgnoreButton = withFallback(
	({
		_suspense,
		listingId,
		meta,
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
							meta,
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
