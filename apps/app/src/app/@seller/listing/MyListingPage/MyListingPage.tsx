import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { ListingList } from "./ListingList";

export namespace MyListingPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the seller listings page with heading chrome and default query for newest listings first.
 * Use it as the route-level entry screen for managing a seller account listing portfolio.
 *
 * @see apps/app/src/@routes
 */
export const MyListingPage: FC<MyListingPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("My listings (title)")}
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
			<Suspense fallback={<ListingList.Fallback />}>
				<ListingList />
			</Suspense>
		</TitleContainer>
	);
};
