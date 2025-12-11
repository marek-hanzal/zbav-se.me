import { ListIcon, type uiIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { ListingIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { useRef } from "react";

export namespace SellerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const SellerMenu = ({ locale, ui, ...props }: SellerMenu.Props) => {
	const icon: uiIcon.Ui = {
		text: "2xl",
	};
	const button: uiButton.Ui = {
		flow: "vertical",
		items: "center",
		tone: "primary",
		theme: "light",
		width: "full",
		justify: "center",
		background: undefined,
		border: false,
		color: "lead",
		text: "lg",
		size: "lg",
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
					inner: "lg",
					items: "center",
					gap: "2xl",
				}}
			>
				<LinkTo
					{...uiButton({
						ui: {
							...button,
						},
						className: [],
					})}
					icon={ListingIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/seller/listing/wizard/photos"
					params={{
						locale,
					}}
				>
					<Tx label="Create listing (label)" />
				</LinkTo>

				<LinkTo
					{...uiButton({
						ui: {
							...button,
						},
						className: [],
					})}
					icon={TransactionIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/seller/transaction/list"
					params={{
						locale,
					}}
				>
					<Tx label="Transactions (label)" />
				</LinkTo>

				<LinkTo
					{...uiButton({
						ui: {
							...button,
						},
						className: [],
					})}
					icon={ListIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/seller/listing/my"
					params={{
						locale,
					}}
				>
					<Tx label="My listings (label)" />
				</LinkTo>

				<LinkTo
					{...uiButton({
						ui: {
							...button,
						},
						className: [],
					})}
					icon={ShopIcon}
					iconProps={{
						ui: {
							...icon,
						},
					}}
					to="/$locale/seller/shop"
					params={{
						locale,
					}}
				>
					<Tx label="Shop (label)" />
				</LinkTo>
			</Container>
		</Container>
	);
};
