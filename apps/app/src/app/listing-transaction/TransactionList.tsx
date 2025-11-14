import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace TransactionList {
	export interface Props extends Container.Props {
		//
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});

	const listingTransactionCollection = withListingTransactionCollectionQuery.useSuspenseQuery({
		sort: [
			{
				field: "updatedAt",
				direction: "desc",
			},
		],
	});

	return (
		<Container {...props}>
			{listingTransactionCollection.data.data.length > 0 ? "list" : null}

			{listingTransactionCollection.data.data.length > 0 ? null : (
				<Container
					layout={"vertical-centered"}
					items={"center"}
				>
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
					/>
				</Container>
			)}
		</Container>
	);
};
