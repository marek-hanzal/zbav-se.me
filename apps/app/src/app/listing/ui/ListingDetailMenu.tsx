import { Container } from "@use-pico/client/ui/container";
import { VariantProvider } from "@use-pico/cls";
import { CartToggleButton, TransactionButton } from "@zbav-se.me/common/listing";
import { GalleryButton } from "@zbav-se.me/common/photo";
import type { tListing } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace ListingDetailMenu {
	export type Tools = "transaction" | "cart";

	export interface Props extends Container.Props {
		locale: string;
		listing: tListing;
		tools?: Tools[];
		parentSheetId: string | undefined;
	}
}

export const ListingDetailMenu: FC<ListingDetailMenu.Props> = ({
	locale,
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
			gap={"lg"}
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

				{tools.includes("cart") ? <CartToggleButton listing={listing} /> : null}

				<GalleryButton uploads={listing.gallery.items.map((item) => item.upload)} />
			</VariantProvider>
		</Container>
	);
};
