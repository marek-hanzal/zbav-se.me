import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, MessageIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { withTransactionQuery } from "@zbav-se.me/sdk/query/buyer/transaction";
import type { FC, ReactNode } from "react";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		renderItem(transactionId: string): ReactNode;
		refetchInterval?: number;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	renderItem,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const locale = useLocale();
	const { data } = withTransactionQuery.useCollectionQuery(
		{
			sort: [
				{
					field: "status",
					order: "asc",
				},
				{
					field: "createdAt",
					order: "desc",
				},
			],
		},
		{
			refetchInterval,
		},
	);
	const { data: transactionCount } = withTransactionQuery.useCountQuery({});

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			{transactionCount.isEmpty ? (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={MessageIcon}
						textTitle={translator.text("No transactions as buyer (title)")}
						textMessage={translator.text("No transactions as buyer (message)")}
						action={
							<LinkTo
								icon={ChevronRightIcon}
								iconPosition={"right"}
								to="/$locale/buyer/feed/default"
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
								<Tx label="Go to my feed (button)" />
							</LinkTo>
						}
						ui={{
							tone: "brand",
							theme: "light",
							inner: "4xl",
						}}
						className={"text-center"}
					/>
				</Container>
			) : transactionCount.isFilterEmpty ? (
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						icon={MessageIcon}
						textTitle={translator.text("No transactions for current filter (title)")}
						textMessage={translator.text(
							"No transactions for current filter (message)",
						)}
						ui={{
							tone: "brand",
							theme: "light",
							inner: "4xl",
						}}
						className={"text-center"}
					/>
				</Container>
			) : (
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "default",
					}}
				>
					{data.map((transactionId) => renderItem(transactionId))}
				</Container>
			)}
		</Container>
	);
};
