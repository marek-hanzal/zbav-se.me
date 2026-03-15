import type { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import type { tTransactionEntryLocation } from "@zbav-se.me/sdk/api/user";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Pending } from "./Pending";
import { TypeContainer } from "../TypeContainer";

export namespace Location {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionEntry: tTransactionEntryLocation;
	}
}

export const Location = withFallback(({ _suspense, transactionEntry, ...props }: Location.Props) => {
	const locale = useLocale();
	const { data: location } = withLocationFetchQuery.useSuspenseQuery({
		where: {
			id: transactionEntry.payload.locationId,
		},
	});

	return (
		<TypeContainer
			direction={transactionEntry.direction}
			ui={{
				flow: "vertical",
			}}
			{...props}
		>
			<Typo
				label={location.address}
				ui={{
					wrap: "wrap",
				}}
				className={"py-1"}
			/>

			<Typo
				label={toTimeDiff({
					locale,
					time: transactionEntry.createdAt,
					type: "relative",
				})}
				ui={{
					text: "sm",
					opacity: "6",
				}}
			/>
		</TypeContainer>
	);
}, Pending);
