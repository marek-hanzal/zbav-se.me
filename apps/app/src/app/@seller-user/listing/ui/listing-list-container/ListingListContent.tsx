import { VisibilityProvider } from "@use-pico/client/context";
import type { useElementVisibility } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tListingQuery } from "@zbav-se.me/sdk/api/seller-user";
import { withListingQuery } from "@zbav-se.me/sdk/query/seller-user/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { Content } from "./Content";

export namespace ListingListContent {
	export interface Props {
		query: tListingQuery;
		locale: string;
		visibility: ReturnType<typeof useElementVisibility>;
	}
}

export const ListingListContent: FC<ListingListContent.Props> = ({ query, locale, visibility }) => {
	const listingCollectionQuery = withListingQuery.useCollectionQuery(query);

	if (listingCollectionQuery.data.length === 0) {
		return (
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<Status
					data-ui={"MyListing-[Status-empty]"}
					icon={SearchIcon}
					textTitle={translator.text("No my listings (title)")}
					textMessage={translator.text("No my listings (message)")}
					action={
						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/seller/draft/resolve"}
							params={{
								locale,
							}}
							ui={{
								background: "default",
								border: true,
								shadow: true,
								round: "default",
								size: "default",
							}}
						>
							<Tx label={"Create listing (label)"} />
						</LinkTo>
					}
					ui={{
						tone: "brand",
						theme: "light",
						color: "lead",
						inner: "4xl",
					}}
					className="text-center"
				/>
			</Container>
		);
	}

	return (
		<VisibilityProvider store={visibility}>
			<Content
				_suspense={"I know"}
				listingIds={listingCollectionQuery.data}
			/>
		</VisibilityProvider>
	);
};
