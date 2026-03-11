import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionList } from "~/app/v0/@buyer/transaction/ui/TransactionList";

export namespace TransactionListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const TransactionListPage: FC<TransactionListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<TransactionList
				query={{
					sort: [
						{
							field: "status",
							order: "asc",
						},
						{
							field: "createdAt",
							order: "desc",
						},
					],
				}}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
