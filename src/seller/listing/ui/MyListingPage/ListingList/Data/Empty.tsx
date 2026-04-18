import type { FC } from "react";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { SearchIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";

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
					{...uiCtaLinkButton({})}
				>
					<Tx label={"Create listing (label)"} />
				</LinkTo>
			}
		/>
	);
};
