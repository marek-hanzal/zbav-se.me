import { useState } from "react";
import { ConfirmButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
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

		const isDisabled = listing.isFavourite || listing.isIgnored || disabled;

		return (
			<>
				<ConfirmButton
					data-ui={"FlagButton"}
					data-action={listing.hasFlag ? "unflag listing" : "flag listing"}
					iconEnabled={FlagIcon}
					iconProps={{
						"data-ui-text": "xl",
					}}
					loading={flagToggleMutation.isPending}
					disabled={isDisabled}
					buttonProps={{
						onClick(event) {
							setIsConfirm(true);
							buttonProps?.onClick?.(event);
						},
						...buttonProps,
					}}
					confirmProps={{
						"data-ui-tone": "danger",
						"data-ui-theme": "light",
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
					data-ui-tone={listing.hasFlag ? "primary" : "neutral"}
					data-ui-theme="light"
					data-ui-size="default"
					data-ui-justify="start"
					data-ui-round={undefined}
					data-ui-width="full"
					{...props}
				>
					<Tx
						label={
							listing.hasFlag ? "Unflag listing (button)" : "Flag listing (button)"
						}
					/>
				</ConfirmButton>

				<Container
					data-ui-inner={"default"}
					data-ui-tone={isConfirm && !listing.hasFlag ? "danger" : "neutral"}
					data-ui-theme={"light"}
					data-ui-background={"default"}
					data-ui-opacity={isDisabled || listing.hasFlag ? "4" : undefined}
				>
					<Mx label={"Listing ignore (hint)"} />
				</Container>
			</>
		);
	},
	({ ...props }: Omit<FlagButton.Props, "_suspense">) => {
		return (
			<ConfirmButton
				disabled
				loading
				data-ui-tone="primary"
				data-ui-theme="light"
				data-ui-size="xl"
				data-ui-justify="start"
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
