import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon, ChevronRightIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { uiCtaLinkButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { EmptyStatus } from "~/app/@common/status/ui/EmptyStatus";

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
						ui={{
							tone: "link",
							theme: "light",
						}}
					>
						<Tx label="Back to home (link)" />
					</LinkTo>

					<LinkTo
						data-action={"create listing"}
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
						<Tx label={"Go to drafts (link)"} />
					</LinkTo>
				</>
			}
		/>
	);
};
