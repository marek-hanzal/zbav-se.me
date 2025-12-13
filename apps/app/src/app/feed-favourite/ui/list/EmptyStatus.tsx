import { ArrowRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { FavouriteIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace EmptyStatus {
	export interface Props extends Status.Props {
		locale: string;
	}
}

export const EmptyStatus: FC<EmptyStatus.Props> = ({ locale, ...props }) => {
	return (
		<Container
			data-ui={"EmptyStatus[Container]"}
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				data-ui={"EmptyStatus-[Status]"}
				icon={FavouriteIcon}
				textTitle={"No items in favourites (title)"}
				textMessage={"No items in favourites (message)"}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					text: "4xl",
					inner: "4xl",
				}}
				className={[
					"text-center",
				]}
				action={
					<LinkTo
						{...uiButton({
							ui: {
								tone: "link",
								theme: "light",
								size: "lg",
								justify: "space-between",
								width: "full",
								text: "lg",
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
				}
				{...props}
			/>
		</Container>
	);
};
