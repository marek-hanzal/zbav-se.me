import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace BuyerEmptyList {
	export interface Props extends Status.Props {
		//
	}
}

export const BuyerEmptyList: FC<BuyerEmptyList.Props> = (props) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Status
			icon={TransactionIcon}
			textTitle={"No transactions found (title)"}
			textMessage={"No transactions found (message)"}
			action={
				<LinkTo
					to={"/$locale/buyer/feed/select"}
					params={{
						locale,
					}}
				>
					<Button
						iconEnabled={ArrowRightIcon}
						iconPosition={"right"}
						label={"Feed selection (button)"}
						size={"xl"}
						tone={"primary"}
						theme={"dark"}
					/>
				</LinkTo>
			}
			{...props}
		/>
	);
};
