import { translator } from "@use-pico/common/translator";
import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
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
