import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tTransactionListingQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller/transaction-listing";
import type { FC } from "react";

export namespace Empty {
	export interface Props {
		query: tTransactionListingQuery;
	}
}

export const Empty: FC<Empty.Props> = ({ query }) => {
	const locale = useLocale();
	const { data: transactionListingCount } = withTransactionListingQuery.useCountQuery(query);

	return transactionListingCount.isEmpty ? (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				icon={MessageIcon}
				textTitle={translator.text("No listings with transactions (title)")}
				textMessage={translator.text("No listings with transactions (message)")}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/seller/listing/my"}
						params={{
							locale,
						}}
						ui={{
							background: "default",
							border: true,
							shadow: true,
							round: "default",
							size: "default",
						}}
					>
						<Tx label={"Go to my listings (button)"} />
					</LinkTo>
				}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className="text-center"
			/>
		</Container>
	) : (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
			}}
		>
			<Status
				icon={MessageIcon}
				textTitle={translator.text("No listings for current filter (title)")}
				textMessage={translator.text("No listings for current filter (message)")}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className="text-center"
			/>
		</Container>
	);
};
