import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { EmptyState } from "@use-pico/client/ui/empty-state";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useMemo } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { Empty } from "../ui/TransactionList/Empty";
import { ListGroup, useCollection } from "./ListGroup";

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
	const { data: activeCollection } = useCollection({
		filter: {
			active: true,
		},
		refetchInterval,
	});
	const { data: inactiveCollection } = useCollection({
		filter: {
			active: false,
			terminal: false,
		},
		refetchInterval,
	});
	const { data: closedCollection } = useCollection({
		filter: {
			active: false,
			terminal: true,
		},
		refetchInterval,
	});
	const check = useMemo(() => {
		return [
			{
				check() {
					return (
						activeCollection.length === 0 &&
						inactiveCollection.length === 0 &&
						closedCollection.length === 0
					);
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		activeCollection,
		inactiveCollection,
		closedCollection,
	]);

	return (
		<TitleContainer
			data-ui="TransactionListPage"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/home"
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
						transactionIds={activeCollection}
						typoUi={{
							tone: "primary",
							theme: "light",
						}}
					/>

					<ListGroup
						label={translator.text("Messages inactive listings section (title)")}
						transactionIds={inactiveCollection}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
						}}
					/>

					<ListGroup
						label={translator.text("Messages closed listings section (title)")}
						transactionIds={closedCollection}
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
