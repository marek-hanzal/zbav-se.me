import { Badge } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
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
									"gap-2",
									"h-fit",
									"w-full",
									"items-start",
									"p-0",
								],
							},
						},
					},
				]}
				round={"default"}
				{...props}
			>
				<div
					className={tvc([
						"w-full",
						"h-32",
					])}
				>
					<HeroImage
						ui={"TransactionItem-image"}
						src={hero.upload.url}
						alt={`Hero image for listing transaction ${listingTransaction.id}`}
						visible
						round
					/>
				</div>

				<div
					className={tvc([
						"py-1",
						"px-2",
					])}
				>
					<Typo
						label={listingTransaction.title}
						truncate
						size={"md"}
					/>
				</div>
			</Badge>
		),
	});
};
