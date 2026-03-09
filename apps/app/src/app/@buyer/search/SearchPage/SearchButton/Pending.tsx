import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo, type uiLinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace Pending {
	export interface Props extends uiLinkTo.Component<{}> {
		feedId: string;
	}
}

export const Pending: FC<Pending.Props> = ({ feedId, ui, className, ...props }) => {
	const locale = useLocale();

	return (
		<LinkTo
			data-ui={"SearchButton[LinkTo.pending]"}
			to="/$locale/buyer/feed/$id/list"
			params={{
				locale,
				id: feedId,
			}}
			icon={SearchIcon}
			iconProps={{
				ui: {
					tone: "primary",
					theme: "light",
					color: "lead",
					text: "xl",
				},
			}}
			ui={{
				tone: "neutral",
				theme: "light",
				size: "default",
				justify: "center",
				items: "center",
				background: "default",
				round: undefined,
				shadow: false,
				border: false,
				width: "full",
				...ui,
			}}
			className={className}
			{...props}
		>
			<Container
				data-ui={"SearchButton-[Container.content.pending]"}
				ui={{
					flow: "horizontal",
					items: "center",
					gap: "default",
					justify: "space-between",
					width: "full",
				}}
			>
				<Tx
					label="Search (button)"
					ui={{
						tone: "primary",
						theme: "light",
						color: "lead",
						text: "xl",
					}}
				/>

				<Tx
					label="Loading... (label)"
					ui={{
						tone: "neutral",
						theme: "light",
						color: "lead",
						text: "xs",
						opacity: "6",
					}}
				/>
			</Container>
		</LinkTo>
	);
};
