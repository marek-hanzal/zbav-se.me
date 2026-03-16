import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
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
	return (
		<TitleContainer
			data-ui="ListingTransactionList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
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
