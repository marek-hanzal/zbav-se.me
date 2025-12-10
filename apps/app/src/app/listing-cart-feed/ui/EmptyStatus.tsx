import { ArrowRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { CartIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace EmptyStatus {
	export interface Props extends Status.Props {
		locale: string;
	}
}

export const EmptyStatus: FC<EmptyStatus.Props> = ({ locale, ...props }) => {
	return (
		<Container
			data-ui={"FeedCartList-EmptyStatus"}
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				icon={CartIcon}
				textTitle={"No items in cart (title)"}
				action={
					<>
						<LinkTo
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									size: "lg",
									justify: "space-between",
									width: "full",
								},
								className: [],
							})}
							icon={ArrowRightIcon}
							iconPosition={"right"}
							to={"/$locale/buyer/feed/default"}
							params={{
								locale,
							}}
						>
							<Tx label={"Go to listings (button)"} />
						</LinkTo>

						<LinkTo
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									size: "lg",
									justify: "space-between",
									width: "full",
								},
								className: [],
							})}
							icon={ArrowRightIcon}
							iconPosition={"right"}
							to={"/$locale/buyer/feed/select"}
							params={{
								locale,
							}}
						>
							<Tx label={"Go home (button)"} />
						</LinkTo>
					</>
				}
				{...props}
			/>
		</Container>
	);
};
