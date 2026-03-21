import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { EmptyStatus } from "~/app/@common/status/ui/EmptyStatus";

export const Empty: FC = () => {
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={SearchIcon}
			textTitle={translator.text("No my listings (title)")}
			textMessage={translator.text("No my listings (message)")}
			action={
				<LinkTo
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to={"/$locale/app/seller/draft/resolve"}
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
		/>
	);
};
