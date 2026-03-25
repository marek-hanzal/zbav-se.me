import { Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import type { tTransactionStatusEnum } from "@zbav-se.me/sdk/api/public";
import type { FC } from "react";
import { match } from "ts-pattern";

export namespace StatusIcon {
	export interface Props {
		status: tTransactionStatusEnum;
	}
}

export const StatusIcon: FC<StatusIcon.Props> = ({ status }) => {
	return (
		<Container
			data-ui="StatusIcon"
			className={"aspect-square h-full shrink-0 overflow-hidden"}
			ui={{
				tone: "subtle",
				theme: "light",
				round: "md",
				height: "full",
				flow: "horizontal",
				items: "center",
				justify: "center",
				background: "default",
			}}
		>
			<Icon
				icon={match(status)
					.with("pending", () => "icon-[solar--clock-circle-linear]")
					.with("open", () => "icon-[solar--dialog-linear]")
					.with("resolved", "success", "sold", () => "icon-[solar--check-circle-linear]")
					.with("dispute", () => "icon-[solar--danger-circle-linear]")
					.with(
						"rejected",
						"expired",
						"closed",
						() => "icon-[solar--lock-keyhole-linear]",
					)
					.exhaustive()}
				ui={{
					text: "2xl",
					color: "text",
					opacity: "7",
				}}
			/>
		</Container>
	);
};
