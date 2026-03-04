import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, type Icon, MessageIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import type { FC } from "react";

export namespace Pending {
	export interface Props {
		iconProps?: Icon.PropsEx;
	}
}

export const Pending: FC<Pending.Props> = ({ iconProps }) => {
	const locale = useLocale();

	return (
		<Group
			ui={{
				tone: "neutral",
				theme: "light",
				background: "default",
			}}
		>
			<TypoIcon
				icon={MessageIcon}
				iconProps={iconProps}
				ui={{
					inner: "lg",
					justify: "start",
					text: "lg",
				}}
			>
				<Tx label={"Loading... (label)"} />
			</TypoIcon>

			<Container
				ui={{
					flow: "horizontal",
					justify: "space-evenly",
					inner: "default",
				}}
			>
				<LinkTo
					to={"/$locale/seller/message/list"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					params={{
						locale,
					}}
					ui={{
						tone: "neutral",
						theme: "light",
						text: "lg",
					}}
				>
					<Tx label={"Loading... (label)"} />
				</LinkTo>

				<LinkTo
					to={"/$locale/buyer/message/list"}
					icon={ChevronRightIcon}
					iconPosition={"right"}
					params={{
						locale,
					}}
					ui={{
						tone: "neutral",
						theme: "light",
						text: "lg",
					}}
				>
					<Tx label={"Loading... (label)"} />
				</LinkTo>
			</Container>
		</Group>
	);
};
