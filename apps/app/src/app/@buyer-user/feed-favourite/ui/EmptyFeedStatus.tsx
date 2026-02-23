import { useLocale } from "@use-pico/client/hook";
import { ChevronLeftIcon, ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { DeadEndIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace EmptyFeedStatus {
	export interface Props extends Container.Props {
		//
	}
}

export const EmptyFeedStatus: FC<EmptyFeedStatus.Props> = ({ ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
			{...props}
		>
			<Status
				icon={DeadEndIcon}
				textTitle={translator.text("No listings in this favourites feed (title)")}
				textMessage={translator.text("Try changing your feed or open all listings (message)")}
				action={
					<Container
						ui={{
							flow: "vertical",
							height: "full",
							width: "full",
							gap: "xl",
						}}
					>
						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/buyer/feed/default"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "xl",
									width: "full",
									size: "lg",
									justify: "center",
								},
								className: [],
							})}
						>
							<Tx label={"Go to feed (link)"} />
						</LinkTo>

						<LinkTo
							icon={ChevronLeftIcon}
							to={"/$locale/flow/buyer/favourite/list"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									width: "full",
									background: undefined,
									border: false,
									shadow: false,
									text: "default",
									justify: "center",
								},
								className: [],
							})}
						>
							<Tx label={"Back to favourites (link)"} />
						</LinkTo>
					</Container>
				}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};
