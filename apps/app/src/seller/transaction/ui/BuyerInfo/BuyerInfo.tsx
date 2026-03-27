import type { MarkSuspense } from "@use-pico/client/type";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { useLocale } from "@/lib/client/locale";
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
 * @see apps/app/src/app//transaction/ui/BuyerInfoButton.tsx
 */
export const BuyerInfo = withFallback(
	({ _suspense, transactionId, ui, ...props }: BuyerInfo.Props) => {
		const locale = useLocale();
		const { data } = withTransactionBuyerInfoQuery.useSuspenseQuery({
			where: {
				id: transactionId,
			},
		});
		const events = data.events;

		return (
			<Container
				ui={{
					flow: "vertical",
					gap: "default",
					...ui,
				}}
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
						textMessage={translator.text(
							"Transaction buyer info not available (message)",
						)}
						ui={{
							tone: "brand",
							theme: "light",
							inner: "2xl",
							opacity: "6",
						}}
						className={"text-center"}
					/>
				)}
			</Container>
		);
	},
	SpinnerContainer,
);
