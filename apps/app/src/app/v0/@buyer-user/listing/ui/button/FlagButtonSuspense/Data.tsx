import type { MarkSuspense } from "@use-pico/client/type";
import { ConfirmButton } from "@use-pico/client/ui/button";
import { Mx } from "@use-pico/client/ui/mx";
import { Tx } from "@use-pico/client/ui/tx";
import { withFlagToggleMutation } from "@zbav-se.me/sdk/mutation/buyer-user/flag";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";

export namespace Data {
	export interface Props extends ConfirmButton.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	listingId,
	buttonProps,
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
	const flagToggleMutation = withFlagToggleMutation.useMutation({
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
	const [isConfirm, setIsConfirm] = useState(false);

	return (
		<>
			<ConfirmButton
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
					...ui,
				}}
				{...props}
			>
				<Tx label={listing.hasFlag ? "Unflag listing (button)" : "Flag listing (button)"} />
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
};
