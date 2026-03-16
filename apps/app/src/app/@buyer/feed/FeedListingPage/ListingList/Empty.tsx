import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
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
			icon={"icon-[streamline--sad-face-remix]"}
			textTitle={translator.text("No listings (title)")}
			action={
				<LinkTo
					data-action={"go home"}
					icon={ChevronLeftIcon}
					to={"/$locale/home"}
					params={{
						locale,
					}}
					ui={{
						tone: "secondary",
						theme: "light",
					}}
				>
					<Tx label="Back to home (link)" />
				</LinkTo>
			}
		/>
	);
};
