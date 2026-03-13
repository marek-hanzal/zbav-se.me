import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tTransactionQuery } from "@zbav-se.me/sdk/api/seller";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/seller/transaction";
import type { FC } from "react";

export namespace Empty {
	export interface Props {
		query: tTransactionQuery;
	}
}

export const Empty: FC<Empty.Props> = ({ query }) => {
	const locale = useLocale();
	const { data: transactionCount } = withTransactionQuery.useCountQuery(query);

	return transactionCount.isEmpty ? (
		<Status
			icon={MessageIcon}
			textTitle={translator.text("No transactions as seller (title)")}
			textMessage={translator.text("No transactions as seller (message)")}
			action={
				<LinkTo
					icon={ChevronRightIcon}
					iconPosition={"right"}
					to="/$locale/seller/listing/my"
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
					<Tx label="Go to my listings (button)" />
				</LinkTo>
			}
			ui={{
				tone: "brand",
				theme: "light",
				inner: "4xl",
			}}
			className={"text-center"}
		/>
	) : (
		<Status
			icon={MessageIcon}
			textTitle={translator.text("No transactions for current filter (title)")}
			textMessage={translator.text("No transactions for current filter (message)")}
			ui={{
				tone: "brand",
				theme: "light",
				inner: "4xl",
			}}
			className={"text-center"}
		/>
	);
};
