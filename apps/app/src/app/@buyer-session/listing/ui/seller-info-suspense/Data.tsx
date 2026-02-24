import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { Header } from "~/app/@buyer-session/listing/ui/seller-info-suspense/Header";
import { Score } from "~/app/@buyer-session/listing/ui/seller-info-suspense/Score";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, listingId, ui, ...props }) => {
	const { data } = withListingSellerInfoQuery.useSuspenseQuery({
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
			<Header
				registered={data.registered}
				listings={data.listings}
			/>

			{data.events ? (
				<Score rank={data.events.score.rank} />
			) : (
				<Status
					icon={SearchIcon}
					textTitle={translator.text("Listing seller info not available (title)")}
					textMessage={translator.text("Listing seller info not available (message)")}
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
};
