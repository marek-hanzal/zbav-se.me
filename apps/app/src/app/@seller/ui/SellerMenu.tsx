import { ListIcon, UserIcon, type uiIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container, type uiContainer } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { BuyerIcon, ListingIcon, ShopIcon, TransactionIcon } from "@zbav-se.me/ui/icon";
import { useRef } from "react";

export namespace SellerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const SellerMenu = ({ locale, ui, ...props }: SellerMenu.Props) => {
	const spacing: uiContainer.Ui = {
		layout: "vertical-flex",
		width: "full",
		gap: "default",
	};
	const icon: uiIcon.Ui = {
		text: "2xl",
	};
	const button: uiButton.Ui = {
		tone: "neutral",
		theme: "light",
		size: "xl",
		width: "full",
		text: "xl",
		gap: "sm",
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

				<Container ui={spacing}>
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
				</Container>

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

				<Container ui={spacing}>
					<LinkTo
						{...uiButton({
							ui: {
								...button,
							},
							className: [],
						})}
						icon={BuyerIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/buyer"
						params={{
							locale,
						}}
					>
						<Tx label="To buyer (label)" />
					</LinkTo>

					<LinkTo
						{...uiButton({
							ui: {
								...button,
							},
							className: [],
						})}
						icon={UserIcon}
						iconProps={{
							ui: {
								...icon,
							},
						}}
						to="/$locale/seller/user"
						params={{
							locale,
						}}
					>
						<Tx label="User profile (label)" />
					</LinkTo>
				</Container>
			</Container>
		</Container>
	);
};
