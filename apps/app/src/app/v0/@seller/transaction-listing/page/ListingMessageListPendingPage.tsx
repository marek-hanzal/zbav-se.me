import { useLocale } from "@use-pico/client/hook";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace ListingMessageListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const ListingMessageListPendingPage: FC<ListingMessageListPendingPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui="SellerMessageList[TitleContainer]"
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
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
