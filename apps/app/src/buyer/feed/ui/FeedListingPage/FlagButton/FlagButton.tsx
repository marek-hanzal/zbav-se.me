import type { MarkSuspense } from "@use-pico/client/type";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Mx } from "@use-pico/client/ui/mx";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { useState } from "react";
import { withFlagToggleMutation } from "~/buyer/flag/mutation/withFlagToggleMutation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { FlagIcon } from "~/common/ui/icon";

export namespace FlagButton {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const FlagButton = withFallback(
	({
		_suspense,
		listingId,
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
