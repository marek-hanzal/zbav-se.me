import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { getRootLogger } from "~/common/log/getRootLogger";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { ListingCard } from "./ListingCard";

export namespace ListingViewPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingViewPage: FC<ListingViewPage.Props> = ({ _suspense, listingId, ...props }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(listingId);

	useRenderLogger({
		logger: getRootLogger(),
		name: "ListingViewPage",
		meta: {
			listingId,
		},
	});

	return (
		<TitleContainer
			data-ui={"ListingViewPage"}
			textTitle={listing.title}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<ListingCard
				_suspense={_suspense}
				listingId={listingId}
				data-ui-height="full"
				data-ui-scroll="vertical"
			/>
		</TitleContainer>
	);
};
