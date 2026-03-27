import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
import { ListingHero } from "./ListingHero";
import { TransactionList } from "./TransactionList";

export namespace ListingTransactionListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		listingId: string;
	}
}

export const ListingTransactionListPage: FC<ListingTransactionListPage.Props> = ({
	_suspense,
	listingId,
	...props
}) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui="ListingTransactionListPage"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/seller/transaction/list"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container>
				<ListingHero
					_suspense={_suspense}
					listingId={listingId}
				/>

				<TransactionList
					_suspense={_suspense}
					listingId={listingId}
					ui={{
						inner: "default",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
