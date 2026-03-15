import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { FavouriteIcon } from "@zbav-se.me/ui/icon";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export const Empty: FC = () => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				data-ui={"BuyerFavouriteList-[Status.empty]"}
				icon={FavouriteIcon}
				textTitle={translator.text("No items in favourites (title)")}
				textMessage={translator.text("No items in favourites (message)")}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/buyer/feed/default"}
						params={{
							locale,
						}}
						{...uiCtaLinkButton({
							className: [],
						})}
					>
						<Tx label={"Go to listings (button)"} />
					</LinkTo>
				}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					text: "4xl",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};
