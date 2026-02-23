import { useLocale } from "@use-pico/client/hook";
import { Container, LabelValue, SpinnerContainer } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { toTimeDiff } from "@use-pico/common/time";
import { translator } from "@use-pico/common/translator";
import { withTransactionBuyerInfoQuery } from "@zbav-se.me/sdk/query/seller-session/transaction";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { BuyerInfoEvents } from "~/app/@seller-session/transaction/ui/buyer-info/BuyerInfoEvents";
import { BuyerInfoScore } from "~/app/@seller-session/transaction/ui/buyer-info/BuyerInfoScore";

export namespace BuyerInfo {
	export interface Props extends Container.Props {
		transactionId: string;
	}
}

export const BuyerInfo: FC<BuyerInfo.Props> = ({ transactionId, ui, ...props }) => {
	const locale = useLocale();

	return (
		<withTransactionBuyerInfoQuery.Suspense
			data={{
				where: {
					id: transactionId,
				},
			}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
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
								<BuyerInfoEvents
									locale={locale}
									events={events}
								/>
								<BuyerInfoScore rank={events.score.rank} />
							</>
						) : (
							<Status
								icon={SearchIcon}
								textTitle={translator.text(
									"Transaction buyer info not available (title)",
								)}
								textMessage={translator.text(
									"Transaction buyer info not available (message)",
								)}
								ui={{
									tone: "brand",
									theme: "light",
									inner: "2xl",
									opacity: "medium",
								}}
								className={"text-center"}
							/>
						)}
					</Container>
				);
			}}
		</withTransactionBuyerInfoQuery.Suspense>
	);
};
