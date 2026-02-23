import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { SellerInfoHeader } from "~/app/@buyer-session/listing/ui/seller-info/SellerInfoHeader";
import { SellerInfoScore } from "~/app/@buyer-session/listing/ui/seller-info/SellerInfoScore";

export namespace SellerInfo {
	export interface Props extends Container.Props {
		listingId: string;
	}
}

export const SellerInfo: FC<SellerInfo.Props> = ({ listingId, ui, ...props }) => {
	return (
		<withListingSellerInfoQuery.Suspense
			data={{
				listingId,
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				return (
					<Container
						ui={{
							flow: "vertical",
							gap: "default",
							height: "full",
							...ui,
						}}
						{...props}
					>
						<SellerInfoHeader
							registered={data.registered}
							listings={data.listings}
						/>

						{data.events ? (
							<SellerInfoScore rank={data.events.score.rank} />
						) : (
							<Status
								icon={SearchIcon}
								textTitle={translator.text(
									"Listing seller info not available (title)",
								)}
								textMessage={translator.text(
									"Listing seller info not available (message)",
								)}
								ui={{
									tone: "brand",
									theme: "light",
									inner: "2xl",
									opacity: "medium",
								}}
								className={"text-center"}
							/>
						)}
					</Container>
				);
			}}
		</withListingSellerInfoQuery.Suspense>
	);
};
