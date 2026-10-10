import { SearchIcon } from "~/application-ui/constant/icon.exports";
import { withListingSellerInfoQuery } from "~/buyer-listing/query/withListingSellerInfoQuery";
import { Header } from "~/buyer-listing/ui/SellerInfo/Header";
import { Score } from "~/buyer-listing/ui/SellerInfo/Score";
import { useTranslator } from "~/translation/hook/useTranslator";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Status } from "~/ui/ui/Status";

export namespace SellerInfo {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
	}
}

/**
 * Wraps seller profile details in suspense so listing-level seller data can resolve asynchronously.
 * Use it inside listing detail flows when buyer context needs seller metadata without blocking the surrounding UI.
 *
 * @see src/listing/ui/SellerInfoButton.tsx
 */
export const SellerInfo = withFallbackFn(({ _suspense, listingId, ...props }: SellerInfo.Props) => {
	const translator = useTranslator();
	const { data: sellerInfo } = withListingSellerInfoQuery.useSuspenseQuery({
		id: listingId,
	});

	return (
		<Container
			data-ui-flow="vertical"
			data-ui-gap="default"
			data-ui-height="full"
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
					textTitle={translator.textFn("Listing seller info not available (title)")}
					textMessage={translator.textFn("Listing seller info not available (message)")}
					data-ui-tone="brand"
					data-ui-theme="light"
					data-ui-inner="2xl"
					data-ui-opacity="6"
					className={"text-center"}
				/>
			)}
		</Container>
	);
}, SpinnerContainer);
