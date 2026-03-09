import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionList } from "~/app/v0/@buyer/transaction/ui/TransactionList";

export namespace MessageListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const MessageListPage: FC<MessageListPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			left={
				<LinkTo
					{...uiBackButton({
						className: [],
					})}
					icon={ArrowLeftIcon}
					to="/$locale/home"
					params={{
						locale,
					}}
				/>
			}
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
