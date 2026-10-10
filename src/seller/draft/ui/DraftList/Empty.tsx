import type { FC } from "react";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { DraftIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";

export namespace Empty {
	export interface Props extends EmptyStatus.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = (props) => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<EmptyStatus
			icon={DraftIcon}
			textTitle={translator.text("No drafts (title)")}
			textMessage={translator.text("No drafts (message)")}
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
					<Tx label={"Create new draft (link)"} />
				</LinkTo>
			}
			{...props}
		/>
	);
};
