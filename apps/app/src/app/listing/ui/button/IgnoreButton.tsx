import { useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@use-pico/client/icon";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { translator } from "@use-pico/common/translator";
import { withIgnoreToggleMutation } from "@zbav-se.me/sdk/mutation/user";
import { withListingFetchQuery, withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";

export namespace IgnoreButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
	}
}

export const IgnoreButton: FC<IgnoreButton.Props> = ({
	listingId,
	confirmProps,
	onReset,
	disabled = false,
	ui,
	...props
}) => {
	const queryClient = useQueryClient();
	const ignoreToggleMutation = withIgnoreToggleMutation.useMutation({
		onSuccess() {
			withListingFetchQuery.invalidate(queryClient, {
				where: {
					id: listingId,
				},
			});
			withListingMetricsFetchQuery.invalidate(queryClient, listingId);
		},
		meta: {
			mutationId: listingId,
		},
	});

	return (
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={
				<ConfirmButton
					label={"Loading... (button)"}
					loading
					{...props}
				/>
			}
		>
			{({ data: listing }) => {
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
						label={
							listing.isIgnored
								? "Unignore listing (button)"
								: "Ignore listing (button)"
						}
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
			}}
		</withListingFetchQuery.Suspense>
	);
};
