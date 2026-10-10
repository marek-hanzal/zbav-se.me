import type { FC } from "react";
import { EmptyStatus } from "~/common/status/ui/EmptyStatus";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronLeftIcon } from "~/ui/constant/ChevronLeftIcon";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace Empty {
	export type Props = {};
}

export const Empty: FC<Empty.Props> = () => {
	const translator = useTranslator();
	const locale = useLocale();

	return (
		<EmptyStatus
			data-ui={"Empty[EmptyStatus]"}
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
						to={"/$locale/app/seller/draft/resolve"}
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
