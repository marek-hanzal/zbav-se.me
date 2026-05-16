import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { toTimeDiff } from "@/lib/common/time";
import { SearchIcon } from "~/common/ui/icon";
import { withTransactionBuyerInfoQuery } from "../../query/withTransactionBuyerInfoQuery";
import { Events } from "./Events";
import { Score } from "./Score";

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
