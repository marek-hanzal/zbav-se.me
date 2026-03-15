import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { SearchIcon } from "@zbav-se.me/ui/icon";
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
				data-ui={"MyListing-[Status.empty]"}
				icon={SearchIcon}
				textTitle={translator.text("No my listings (title)")}
				textMessage={translator.text("No my listings (message)")}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/seller/draft/resolve"}
						params={{
							locale,
						}}
						{...uiCtaLinkButton({
							className: [],
						})}
					>
						<Tx label={"Create listing (label)"} />
					</LinkTo>
				}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className="text-center"
			/>
		</Container>
	);
};
