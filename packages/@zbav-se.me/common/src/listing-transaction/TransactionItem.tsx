import { Badge } from "@use-pico/client/ui/badge";
import { PriceInline } from "@use-pico/client/ui/price-inline";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import type { tGalleryItem, tListingTransaction } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC, PropsWithChildren, ReactNode } from "react";

export namespace TransactionItem {
	export namespace Item {
		export interface Props extends PropsWithChildren {
			listingTransaction: tListingTransaction;
		}

		export type RenderFn = (props: Item.Props) => ReactNode;
	}

	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		listingTransaction: tListingTransaction;
		renderItemFn: Item.RenderFn;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	locale,
	listingTransaction,
	tweak,
	renderItemFn,
	...props
}) => {
	const [hero] = listingTransaction.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	return renderItemFn({
		listingTransaction,
		children: (
			<Badge
				size={"xl"}
				tweak={[
					tweak,
					{
						slot: {
							root: {
								class: [
									"flex",
									"flex-col",
									"gap-4",
									"h-72",
									"w-full",
									"items-start",
									"p-0",
									"relative",
									"border-none",
								],
							},
						},
					},
				]}
				round={"default"}
				{...props}
			>
				<HeroImage
					ui={"TransactionItem-image"}
					src={hero.upload.url}
					alt={`Hero image for listing transaction ${listingTransaction.id}`}
					visible
					round
				/>

				<Badge
					ui={"TransactionItem-price"}
					tone={"secondary"}
					theme={"light"}
					round={"default"}
					snapTo={"top-center"}
					tweak={{
						slot: {
							root: {
								class: [
									"max-w-1/2",
								],
							},
						},
					}}
				>
					{listingTransaction.price > 0 ? (
						<PriceInline
							price={listingTransaction.price}
							locale={locale}
							currency={listingTransaction.currency}
						/>
					) : (
						<Tx label={"Price - free"} />
					)}
				</Badge>

				<Badge
					ui={"TransactionItem-bottom"}
					size={"lg"}
					round={"default"}
					snapTo={"bottom"}
					tweak={{
						slot: {
							root: {
								class: [
									"flex",
									"flex-col",
									"gap-1",
									"opacity-85",
									"overflow-hidden",
									"h-fit",
								],
							},
						},
					}}
				>
					<Typo
						truncate
						label={listingTransaction.location}
					/>

					<Typo
						label={listingTransaction.title}
						truncate
						size={"sm"}
					/>
				</Badge>
			</Badge>
		),
	});
};
