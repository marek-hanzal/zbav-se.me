import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon, NotificationIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user";
import { TypoIcon } from "@zbav-se.me/ui/typo";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Pick<LinkTo.Props, "ui" | "iconProps">, MarkSuspense.Props {
		//
	}
}

export const Data: FC<Data.Props> = ({ _suspense, ...props }) => {
	const locale = useLocale();
	const { data: count } = withInboxQuery.useCountQuery({
		where: {
			archivedAtIsNull: true,
		},
	});

	return (
		<LinkTo
			{...uiMenuButton({
				className: [],
			})}
			icon={NotificationIcon}
			to="/$locale/inbox/list"
			params={{
				locale,
			}}
			activeProps={uiMenuButton({
				ui: {
					tone: "primary",
					theme: "light",
				},
				className: [],
			})}
			{...uiMenuButton({
				ui: {
					tone: count.filter > 0 ? "secondary" : "neutral",
					theme: "light",
				},
				className: [],
			})}
			{...props}
		>
			<TypoIcon
				flip
				icon={ChevronRightIcon}
				iconProps={{
					ui: {
						opacity: "5",
					},
				}}
			>
				<Container
					ui={{
						flow: "horizontal",
						gap: "default",
						items: "center",
					}}
				>
					<Tx label="Inbox (label)" />

					<Typo
						ui={{
							text: "sm",
						}}
						label={`(${toLocaleNumber({
							number: count.filter,
							locale,
						})})`}
					/>
				</Container>
			</TypoIcon>
		</LinkTo>
	);
};
