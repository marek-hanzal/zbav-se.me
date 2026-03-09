import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import type { tInboxQuery } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { InboxList } from "./InboxList/InboxList";

export namespace InboxListPage {
	export interface Props extends TitleContainer.Props {
		query: tInboxQuery;
	}
}

export const InboxListPage: FC<InboxListPage.Props> = ({ query, ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Inbox (title)")}
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
			<InboxList query={query} />
		</TitleContainer>
	);
};
