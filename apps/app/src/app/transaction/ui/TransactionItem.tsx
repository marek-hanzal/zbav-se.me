import type { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { StateType } from "@use-pico/common/type";
import type { tGalleryItem, tTransaction, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, Suspense } from "react";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
import { TransactionLogList } from "~/app/transaction-log/ui/TransactionLogList";

export namespace TransactionItem {
	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		side: tUserSideEnum;
		transaction: tTransaction;
		open: StateType.Simple<string | undefined>;
	}
}

export const TransactionItem: FC<TransactionItem.Props> = ({
	locale,
	side,
	transaction,
	open,
	ui,
	...props
}) => {
	const [hero] = transaction.gallery.items as [
		tGalleryItem,
		...tGalleryItem[],
	];

	return (
		<>
			<Container
				data-ui={"TransactionItem[Container]"}
				data-id={transaction.id}
				onClick={() => open.set(transaction.id)}
				ui={{
					round: "default",
					position: "relative",
					shadow: true,
					border: true,
					...ui,
				}}
				className={[
					"h-72",
				]}
				{...props}
			>
				<HeroImage
					data-ui={"TransactionItem-[HeroImage]"}
					src={hero.upload.url}
					alt={`Hero image for listing transaction ${transaction.id}`}
					visible
					round={"default"}
				/>

				<ListingOverlay
					data-ui={"TransactionItem-[ListingOverlay]"}
					locale={locale}
					listing={transaction}
				/>
			</Container>

			<BottomSheet
				data-ui={"TransactionItem-[BottomSheet]"}
				isOpen={open.value === transaction.id}
				onClose={() => open.set(undefined)}
				detent={"full"}
				contentProps={{
					disableScroll: true,
				}}
				header={{
					close: true,
					title: transaction.title,
				}}
			>
				<Suspense fallback={<SpinnerContainer />}>
					<TransactionLogList
						_suspense={"I know"}
						data-ui={"TransactionItem-[TransactionLogList]"}
						locale={locale}
						side={side}
						transaction={transaction}
						query={{
							where: {
								transactionId: transaction.id,
							},
							sort: [
								{
									field: "createdAt",
									direction: "asc",
								},
							],
						}}
					/>
				</Suspense>
			</BottomSheet>
		</>
	);
};
