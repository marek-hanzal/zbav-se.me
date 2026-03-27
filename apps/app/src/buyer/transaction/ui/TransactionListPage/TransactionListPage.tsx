import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useMemo } from "react";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
import { withTransactionQuery } from "../../query/withTransactionQuery";
import { Empty } from "../TransactionList/Empty";
import { ListGroup } from "./ListGroup";

export namespace TransactionListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		refetchInterval?: number;
	}
}

export const TransactionListPage: FC<TransactionListPage.Props> = ({
	_suspense,
	refetchInterval = 5_000,
	...props
}) => {
	const locale = useLocale();
	const { data: hasTransaction } = withTransactionQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
	});

	const check = useMemo(() => {
		return [
			{
				check() {
					return !hasTransaction.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		hasTransaction,
	]);

	return (
		<TitleContainer
			data-ui="TransactionListPage"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<EmptyState check={check}>
				<Container
					ui={{
						scroll: "vertical",
						height: "full",
						layout: "vertical-flex",
						gap: "2xl",
						inner: "default",
					}}
				>
					<ListGroup
						label={translator.text("Messages active listings section (title)")}
						filter={{
							active: true,
						}}
						refetchInterval={refetchInterval}
						typoUi={{
							tone: "primary",
							theme: "light",
						}}
					/>

					<ListGroup
						label={translator.text("Messages inactive listings section (title)")}
						filter={{
							active: false,
							terminal: false,
						}}
						refetchInterval={refetchInterval}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
						}}
					/>

					<ListGroup
						label={translator.text("Messages closed listings section (title)")}
						filter={{
							active: false,
							terminal: true,
						}}
						refetchInterval={refetchInterval}
						ui={{
							opacity: "7",
						}}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
						}}
					/>
				</Container>
			</EmptyState>
		</TitleContainer>
	);
};
