import { withListingSellerInfoQuery } from "~/buyer/listing/query/withListingSellerInfoQuery";
import { SearchIcon } from "~/common/ui/icon";
import { useTranslator } from "~/translation/hook/useTranslator";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Status } from "~/ui/ui/Status";
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
 * @see src/listing/ui/SellerInfoButton.tsx
 */
export const SellerInfo = withFallback(({ _suspense, listingId, ...props }: SellerInfo.Props) => {
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
					textTitle={translator.text("Listing seller info not available (title)")}
					textMessage={translator.text("Listing seller info not available (message)")}
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
