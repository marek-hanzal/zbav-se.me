import { ListIcon, type uiIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { ListingIcon, MessageIcon } from "@zbav-se.me/ui/icon";
import { uiMenuButton } from "@zbav-se.me/ui/ui";
import { useRef } from "react";

export namespace SellerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const SellerMenu = ({ locale, ui, ...props }: SellerMenu.Props) => {
	const icon: uiIcon.Ui = {
		text: "3xl",
	};

	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"SellerMenu"}
			ui={{
				position: "relative",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				data-ui={"SellerMenu-container"}
				ref={containerRef}
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					height: "full",
					inner: "default",
					items: "center",
					gap: "lg",
				}}
			>
				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={ListingIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/draft/resolve"
					params={{
						locale,
					}}
				>
					<Tx label={"Create listing (label)"} />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={ListingIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/draft/resolve"
					params={{
						locale,
					}}
				>
					<Tx label={"Draft list (label)"} />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={MessageIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/message/list"
					params={{
						locale,
					}}
				>
					<Tx label="Messages (label)" />
				</LinkTo>

				<LinkTo
					{...uiMenuButton({
						className: [],
					})}
					icon={ListIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/ui/seller/listing/my"
					params={{
						locale,
					}}
				>
					<Tx label="My listings (label)" />
				</LinkTo>
			</Container>
		</Container>
	);
};
