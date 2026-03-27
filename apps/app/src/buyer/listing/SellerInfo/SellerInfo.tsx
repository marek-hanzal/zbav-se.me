import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { Status } from "@use-pico/client/ui/status";
import { withFallback } from "@use-pico/client/utils";
import { translator } from "@use-pico/common/translator";
import { withListingSellerInfoQuery } from "~/buyer/listing/query/withListingSellerInfoQuery";
import { SearchIcon } from "~/common/ui/icon";
import { Header } from "./Header";
import { Score } from "./Score";

export namespace SellerInfo {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

/**
 * Wraps seller profile details in suspense so listing-level seller data can resolve asynchronously.
 * Use it inside listing detail flows when buyer context needs seller metadata without blocking the surrounding UI.
 *
 * @see apps/app/src/app//listing/ui/SellerInfoButton.tsx
 */
export const SellerInfo = withFallback(
	({ _suspense, listingId, ui, ...props }: SellerInfo.Props) => {
		const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
			id: listingId,
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
	},
	SpinnerContainer,
);
