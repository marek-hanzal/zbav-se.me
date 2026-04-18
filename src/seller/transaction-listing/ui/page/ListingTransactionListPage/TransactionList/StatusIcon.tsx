import type { FC } from "react";
import { match } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Icon } from "@/lib/client/icon";
import type { TransactionStatusEnumSchema } from "~/common/user-transaction/enum/TransactionStatusEnumSchema";

export namespace StatusIcon {
	export interface Props {
		status: TransactionStatusEnumSchema.Type;
	}
}

export const StatusIcon: FC<StatusIcon.Props> = ({ status }) => {
	return (
		<Container
			data-ui="StatusIcon"
			className={"aspect-square h-full shrink-0 overflow-hidden"}
			data-ui-tone="subtle"
			data-ui-theme="light"
			data-ui-round="md"
			data-ui-height="full"
			data-ui-flow="horizontal"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-background="default"
		>
			<Icon
				icon={match(status)
					.with("interest", () => "icon-[solar--clock-circle-linear]")
					.with("trade", () => "icon-[solar--dialog-linear]")
					.with("resolved", "success", "sold", () => "icon-[solar--check-circle-linear]")
					.with("dispute", () => "icon-[solar--danger-circle-linear]")
					.with(
						"rejected",
						"expired",
						"closed",
						() => "icon-[solar--lock-keyhole-linear]",
					)
					.exhaustive()}
				data-ui-text="2xl"
				data-ui-color="text"
				data-ui-opacity="7"
			/>
		</Container>
	);
};
