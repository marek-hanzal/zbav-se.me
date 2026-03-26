import { useLocale } from "@use-pico/client/hook";
import type { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/public";
import type { tTransactionEntryCommon } from "@zbav-se.me/sdk/api/user";
import type { FC } from "react";
import { TypeContainer } from "../TypeContainer";

export namespace Common {
	export interface Props extends Container.Props {
		side: tUserSideEnum;
		transactionEntry: tTransactionEntryCommon;
	}
}

export const Common: FC<Common.Props> = ({ side, transactionEntry, ...props }) => {
	const locale = useLocale();

	return (
		<TypeContainer
			data-ui={"CommonEntry[TypeContainer]"}
			direction={transactionEntry.direction}
			className={"w-full"}
			{...props}
		>
			<Mx
				label={`transaction - ${side} - ${transactionEntry.payload.text}`}
				fallback={transactionEntry.payload.text}
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
};
