import { Container } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";
import { CartToggleButton } from "~/app/listing/ui/button/CartToggleButton";
import { TransactionButton } from "~/app/listing/ui/button/TransactionButton";
import { GalleryButton } from "~/app/photo/ui/button/GalleryButton";

export namespace ListingDetailMenu {
	export type Tools = "transaction" | "cart";

	export interface Props extends Container.Props {
		locale: string;
		feedId: string;
		listing: tListing;
		tools?: Tools[];
		parentSheetId: string | undefined;
	}
}

export const ListingDetailMenu: FC<ListingDetailMenu.Props> = ({
	locale,
	feedId,
	listing,
	tools = [
		"transaction",
		"cart",
	],
	parentSheetId,
	...props
}) => {
	return (
		<Container
			layout={"vertical-flex"}
			height={"content"}
			gap={"sm"}
			{...props}
		>
			<VariantProvider
				cls={ThemeCls}
				variant={{
					tone: "secondary",
					theme: "light",
				}}
			>
				{tools.includes("transaction") ? (
					<TransactionButton
						locale={locale}
						listing={listing}
						parentSheetId={parentSheetId}
					/>
				) : null}

				{tools.includes("cart") ? (
					<CartToggleButton
						feedId={feedId}
						listing={listing}
					/>
				) : null}

				<GalleryButton uploads={listing.gallery.items.map((item) => item.upload)} />
			</VariantProvider>
		</Container>
	);
};
