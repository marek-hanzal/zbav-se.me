import { ConfirmButton } from "@/lib/client/button";
import { withFallback } from "@/lib/client/fallback";
import { TrashIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { withIgnoreToggleMutation } from "~/buyer/listing-ignore/mutation/withIgnoreToggleMutation";

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
		...props
	}: IgnoreButton.Props) => {
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const ignoreToggleMutation = withIgnoreToggleMutation.useMutation({
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
					"data-ui-text": "xl",
				}}
				loading={ignoreToggleMutation.isPending}
				disabled={listing.isFavourite || disabled}
				confirmProps={{
					"data-ui-tone": "warning",
					"data-ui-theme": "light",
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
				data-ui-tone={listing.isIgnored ? "primary" : "neutral"}
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="start"
				data-ui-round={undefined}
				data-ui-width="full"
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
	({ ...props }: Omit<IgnoreButton.Props, "_suspense">) => {
		return (
			<ConfirmButton
				loading
				data-ui-round={undefined}
				data-ui-border={false}
				data-ui-shadow={false}
				data-ui-width="full"
				{...props}
			>
				<Tx label="Loading... (button)" />
			</ConfirmButton>
		);
	},
);
