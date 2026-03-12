import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tTransactionEntryPersonal } from "@zbav-se.me/sdk/api/user";
import { withLocationFetchQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";
import { TypeContainer } from "./TypeContainer";

export namespace Personal {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryPersonal;
	}
}

export const Personal: FC<Personal.Props> = ({ transactionEntry, ...props }) => {
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
			<Container
				ui={{
					layout: "vertical-flex",
					gap: "xs",
				}}
			>
				<Typo
					label={transactionEntry.payload.name}
					ui={{
						wrap: "wrap",
						font: "bold",
					}}
					className={"py-1"}
				/>

				<Typo
					label={transactionEntry.payload.phone}
					ui={{
						wrap: "wrap",
					}}
				/>

				<Typo
					label={transactionEntry.payload.email}
					ui={{
						wrap: "wrap",
					}}
					className={"py-1"}
				/>

				<Typo
					label={location.address}
					ui={{
						wrap: "wrap",
					}}
					className={"py-1"}
				/>
			</Container>

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
};
