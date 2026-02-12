import { ConfirmButton } from "@use-pico/client/ui/button";
import { Mx } from "@use-pico/client/ui/mx";
import { translator } from "@use-pico/common/translator";
import { withFlagToggleMutation } from "@zbav-se.me/sdk/mutation/buyer-user/flag";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-user/listing";
import { FlagIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";

export namespace FlagButton {
	export interface Props extends ConfirmButton.Props {
		listingId: string;
	}
}

export const FlagButton: FC<FlagButton.Props> = ({
	listingId,
	buttonProps,
	confirmProps,
	onReset,
	disabled = false,
	ui,
	...props
}) => {
	const patch = withListingFetchQuery.useSet();
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
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={
				<ConfirmButton
					label={"Loading... (button)"}
					disabled
					loading
					ui={{
						tone: "primary",
						theme: "light",
						size: "xl",
						justify: "start",
						...ui,
					}}
					{...props}
				/>
			}
		>
			{({ data: listing }) => {
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
							label={
								listing.hasFlag
									? "Unflag listing (button)"
									: "Flag listing (button)"
							}
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
								label: translator.text("Flag listing - confirm (button)"),
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
						/>

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
			}}
		</withListingFetchQuery.Suspense>
	);
};
