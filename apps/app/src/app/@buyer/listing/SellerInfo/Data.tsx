import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { Header } from "./Header";
import { Score } from "./Score";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId, ui, ...props }) => {
	const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
		listingId,
	});

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
			<Header sellerInfo={sellerInfo} />

			{sellerInfo.events ? (
				<Group>
					<Score rank={sellerInfo.events.score.rank} />
				</Group>
			) : (
				<Status
					icon={SearchIcon}
					textTitle={translator.text("Listing seller info not available (title)")}
					textMessage={translator.text("Listing seller info not available (message)")}
					ui={{
						tone: "brand",
						theme: "light",
						inner: "2xl",
						opacity: "6",
					}}
					className={"text-center"}
				/>
			)}
		</Container>
	);
};
