import { useState } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { withFallback } from "@/lib/client/fallback";
import { Mx } from "@/lib/client/mx";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { withFlagToggleMutation } from "~/buyer/flag/mutation/withFlagToggleMutation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";
import { FlagIcon } from "~/common/ui/icon";

export namespace FlagButton {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
		meta: ListingMetaSchema.Type | undefined;
	}
}

export const FlagButton = withFallback(
	({
		_suspense,
		listingId,
		meta,
		buttonProps,
		confirmProps,
		onReset,
		disabled = false,
		ui,
		...props
	}: FlagButton.Props) => {
		const { data: listing } = withListingQuery.useFetchQuery(listingId);
		const update = withListingQuery.useUpdate();
		const flagToggleMutation = withFlagToggleMutation.useMutation({
			onSuccess: update,
			meta: {
				mutationId: listingId,
			},
		});
		const [isConfirm, setIsConfirm] = useState(false);

		return (
			<>
				<ConfirmButton
					data-ui={"FlagButton"}
					data-action={listing.hasFlag ? "unflag listing" : "flag listing"}
					iconEnabled={FlagIcon}
					iconProps={{
						ui: {
							text: "xl",
						},
					}}
					loading={flagToggleMutation.isPending}
					disabled={listing.isFavourite || listing.isIgnored || disabled}
					buttonProps={{
						onClick(event) {
							setIsConfirm(true);
							buttonProps?.onClick?.(event);
						},
						...buttonProps,
					}}
					confirmProps={{
						ui: {
							tone: "danger",
							theme: "light",
						},
						children: <Tx label="Flag listing - confirm (button)" />,
						...confirmProps,
						onClick(e) {
							flagToggleMutation.mutate({
								toggle: !listing.hasFlag,
								listingId: listing.id,
								meta,
							});
							setIsConfirm(false);
							confirmProps?.onClick?.(e);
						},
					}}
					onReset={() => {
						setIsConfirm(false);
						onReset?.();
					}}
					ui={{
						tone: listing.hasFlag ? "primary" : "neutral",
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
							listing.hasFlag ? "Unflag listing (button)" : "Flag listing (button)"
						}
					/>
				</ConfirmButton>

				{listing.hasFlag ? null : (
					<Mx
						label={"Listing ignore (hint)"}
						ui={
							isConfirm
								? {
										tone: "danger",
										theme: "light",
										color: "lead",
										text: "sm",
										background: "default",
										inner: "default",
									}
								: {
										tone: "neutral",
										theme: "light",
										text: "sm",
										background: "default",
										inner: "default",
									}
						}
					/>
				)}
			</>
		);
	},
	({ ui, ...props }: Omit<FlagButton.Props, "_suspense">) => {
		return (
			<ConfirmButton
				disabled
				loading
				ui={{
					tone: "primary",
					theme: "light",
					size: "xl",
					justify: "start",
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
