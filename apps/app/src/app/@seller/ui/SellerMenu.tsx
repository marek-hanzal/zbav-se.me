import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import { useRef } from "react";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

export namespace SellerMenu {
	export interface Props extends Container.Props {
		locale: string;
	}
}

export const SellerMenu = ({ locale, ui, ...props }: SellerMenu.Props) => {
	const spacing = tvc([
		"w-full",
		"flex",
		"flex-col",
		"gap-2",
		"py-4",
	]);
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui={"SellerMenu"}
			ui={{
				position: "relative",
				...ui,
			}}
			{...props}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				data-ui="Seller-container"
				ui={{
					layout: "vertical-flex",
					scroll: "vertical",
					gap: "sm",
				}}
			>
				<LinkTo
					{...uiButton({
						ui: {
							tone: "primary",
							theme: "light",
							justify: "start",
							round: "default",
							size: "xl",
						},
						className: [],
					})}
					to="/$locale/seller/listing/wizard/photos"
					params={{
						locale,
					}}
				>
					<Tx label="Create listing (label)" />
				</LinkTo>

				<div className={spacing}>
					<LinkTo
						{...uiButton({
							ui: {
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
							},
							className: [],
						})}
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
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
							},
							className: [],
						})}
						to="/$locale/seller/transaction/list"
						params={{
							locale,
						}}
					>
						<Tx label="Transactions (label)" />
					</LinkTo>
				</div>

				<LinkTo
					{...uiButton({
						ui: {
							tone: "secondary",
							theme: "light",
							justify: "start",
							round: "default",
							size: "xl",
						},
						className: [],
					})}
					to="/$locale/seller/shop"
					params={{
						locale,
					}}
				>
					<Tx label="Shop (label)" />
				</LinkTo>

				<div className={spacing}>
					<LinkTo
						{...uiButton({
							ui: {
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
							},
							className: [],
						})}
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
								tone: "secondary",
								theme: "light",
								justify: "start",
								round: "default",
								size: "xl",
							},
							className: [],
						})}
						to="/$locale/seller/user"
						params={{
							locale,
						}}
					>
						<Tx label="User profile (label)" />
					</LinkTo>
				</div>

				<SignOutButton locale={locale} />
			</Container>
		</Container>
	);
};
