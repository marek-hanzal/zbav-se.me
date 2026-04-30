import type { FC } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { uiCtaLinkButton } from "~/common/ui/ui";

export namespace Empty {
	export type Props = {};
}

export const Empty: FC<Empty.Props> = () => {
	const locale = useLocale();

	return (
		<EmptyStatus
			data-ui={"Empty"}
			icon={"icon-[solar--cup-first-broken]"}
			textTitle={translator.text("No listings - all empty (title)")}
			textMessage={translator.text("No listings - all empty (message)")}
			action={
				<>
					<LinkTo
						data-action={"go home"}
						icon={ChevronLeftIcon}
						to={"/$locale/app/home"}
						params={{
							locale,
						}}
						data-ui-tone="link"
						data-ui-theme="light"
					>
						<Tx label="Back to home (link)" />
					</LinkTo>

					<LinkTo
						data-action={"create listing"}
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/app/seller/listing/resolve"}
						params={{
							locale,
						}}
						{...uiCtaLinkButton({})}
					>
						<Tx label={"Go to drafts (link)"} />
					</LinkTo>
				</>
			}
		/>
	);
};
