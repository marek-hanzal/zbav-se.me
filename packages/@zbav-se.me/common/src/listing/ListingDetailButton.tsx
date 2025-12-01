import { ShowIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { isString } from "@use-pico/common/is-string";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useState } from "react";
import { ListingDetailContainer } from "./ListingDetailContainer";

export namespace ListingDetailButton {
	export interface Props extends Button.Props {
		locale: string;
		detailSheetId: string;
		listing: tListing | string;
	}
}

export const ListingDetailButton: FC<ListingDetailButton.Props> = ({
	locale,
	detailSheetId,
	listing,
	children,
	...props
}) => {
	const [detail, setDetail] = useState(false);

	return (
		<>
			<Button
				iconEnabled={ShowIcon}
				iconPosition={"right"}
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				round={"md"}
				onClick={() => setDetail(true)}
				border={false}
				menu
				{...props}
			/>

			<BottomSheet
				id={detailSheetId}
				isOpen={detail}
				onClose={() => setDetail(false)}
				detent={"full"}
			>
				{isString(listing) ? (
					<withListingFetchQuery.Suspense
						data={{
							where: {
								id: listing,
							},
						}}
						fallback={<SpinnerContainer />}
					>
						{({ data }) => {
							return (
								<ListingDetailContainer
									parentSheetId={detailSheetId}
									locale={locale}
									listing={data}
									withScore
									square={"md"}
								>
									{children}
								</ListingDetailContainer>
							);
						}}
					</withListingFetchQuery.Suspense>
				) : (
					<ListingDetailContainer
						parentSheetId={detailSheetId}
						locale={locale}
						listing={listing}
						withScore
						square={"md"}
					>
						{children}
					</ListingDetailContainer>
				)}
			</BottomSheet>
		</>
	);
};
