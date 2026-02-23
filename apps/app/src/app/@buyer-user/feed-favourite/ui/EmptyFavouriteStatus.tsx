import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace EmptyFavouriteStatus {
	export interface Props extends Status.Props {
		//
	}
}

export const EmptyFavouriteStatus: FC<EmptyFavouriteStatus.Props> = ({ ...props }) => {
	const locale = useLocale();

	return (
		<Status
			icon={DeadEndIcon}
			textTitle={translator.text("No favourites yet (title)")}
			action={
				<>
					<LinkTo
						to={"/$locale/flow/buyer/feed/default"}
						icon={ChevronRightIcon}
						iconPosition={"right"}
						params={{
							locale,
						}}
						{...uiButton({
							ui: {
								width: "full",
								justify: "center",
							},
							className: [],
						})}
					>
						<Tx label={"Go to feed (link)"} />
					</LinkTo>

					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/flow/home"}
						params={{
							locale,
						}}
						{...uiButton({
							ui: {
								tone: "link",
								theme: "light",
								width: "full",
								justify: "center",
							},
							className: [],
						})}
					>
						<Tx label={"Go to home (link)"} />
					</LinkTo>
				</>
			}
			ui={{
				tone: "brand",
				theme: "light",
			}}
			{...props}
		/>
	);
};
