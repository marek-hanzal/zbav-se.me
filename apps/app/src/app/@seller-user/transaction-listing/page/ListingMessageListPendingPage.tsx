import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";

export namespace ListingMessageListPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const ListingMessageListPendingPage: FC<ListingMessageListPendingPage.Props> = ({
	children,
	ui,
	...props
}) => {
	const locale = useLocale();

	return (
		<TitleContainer
			data-ui="SellerMessageList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			left={
				<LinkTo
					icon={ChevronLeftIcon}
					to="/$locale/flow/seller/message/list"
					params={{
						locale,
					}}
				/>
			}
			ui={ui}
			{...props}
		>
			<SpinnerContainer />

			{children}
		</TitleContainer>
	);
};
