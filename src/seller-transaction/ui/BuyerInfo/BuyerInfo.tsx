import { SearchIcon } from "~/application-ui/constant/icon.exports";
import { toTimeDiff } from "~/date/fn/toTimeDiff";
import { useLocale } from "~/locale/hook/useLocale";
import { withTransactionBuyerInfoQuery } from "~/seller-transaction/query/withTransactionBuyerInfoQuery";
import { Events } from "~/seller-transaction/ui/BuyerInfo/Events";
import { Score } from "~/seller-transaction/ui/BuyerInfo/Score";
import { useTranslator } from "~/translation/hook/useTranslator";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { LabelValue } from "~/ui/ui/LabelValue";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Status } from "~/ui/ui/Status";

export namespace BuyerInfo {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
	}
}

/**
 * Wraps buyer transaction details in suspense so participant information can load independently.
 * Use it in seller-side transaction flows when buyer profile context is shown on demand.
 *
 * @see src/transaction/ui/BuyerInfoButton.tsx
 */
export const BuyerInfo = withFallback(({ _suspense, transactionId, ...props }: BuyerInfo.Props) => {
	const translator = useTranslator();
	const locale = useLocale();
	const { data } = withTransactionBuyerInfoQuery.useSuspenseQuery({
		where: {
			id: transactionId,
		},
	});
	const events = data.events;

	return (
		<Container
			data-ui-flow="vertical"
			data-ui-gap="default"
			{...props}
		>
			<LabelValue
				textLabel={translator.text("User registered (label)")}
				textValue={toTimeDiff({
					locale,
					time: data.registered,
					type: "relative",
				})}
			/>

			{events ? (
				<>
					<Events events={events} />
					<Score rank={events.score.rank} />
				</>
			) : (
				<Status
					icon={SearchIcon}
					textTitle={translator.text("Transaction buyer info not available (title)")}
					textMessage={translator.text("Transaction buyer info not available (message)")}
					data-ui-tone="brand"
					data-ui-theme="light"
					data-ui-inner="2xl"
					data-ui-opacity="6"
					className={"text-center"}
				/>
			)}
		</Container>
	);
}, SpinnerContainer);
