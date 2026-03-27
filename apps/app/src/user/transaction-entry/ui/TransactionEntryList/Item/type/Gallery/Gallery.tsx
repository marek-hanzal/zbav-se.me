import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import type { Container } from "@use-pico/client/ui/container";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { toTimeDiff } from "@use-pico/common/time";
import { HeroImage } from "@zbav-se.me/ui/img";
import { useState } from "react";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { GalleryPreviewSheet } from "~/common/gallery/ui/GalleryPreviewSheet";
import { withTransactionEntryGalleryFetchQuery } from "~/user/transaction-entry/query/withTransactionEntryGalleryFetchQuery";
import type { TransactionEntryGallery } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/GallerySchema";
import { TypeContainer } from "../TypeContainer";

export namespace Gallery {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionEntry: TransactionEntryGallery.Type;
	}
}

export const Gallery = withFallback(
	({ _suspense, transactionEntry, ...props }: Gallery.Props) => {
		const locale = useLocale();
		const { data: gallery } = withTransactionEntryGalleryFetchQuery.useSuspenseQuery({
			where: {
				transactionEntryId: transactionEntry.id,
			},
		});
		const hero = useUpload(gallery.items);
		const [isGalleryOpen, setIsGalleryOpen] = useState(false);

		return (
			<TypeContainer
				direction={transactionEntry.direction}
				ui={{
					position: "relative",
					theme: undefined,
					background: undefined,
					round: undefined,
					inner: undefined,
				}}
				className={"h-48"}
				{...props}
			>
				<HeroImage
					src={hero.url}
					visible
					ui={{
						tone: "neutral",
						theme: "light",
						background: "default",
						round: "default",
					}}
					onClick={() => setIsGalleryOpen((prev) => !prev)}
				/>

				<Typo
					label={toTimeDiff({
						locale,
						time: transactionEntry.createdAt,
						type: "relative",
					})}
					ui={{
						tone: "neutral",
						theme: "light",
						background: "default",
						text: "sm",
						round: "default",
						inner: "default",
						opacity: "8",
						snapTo: "bottom-left",
					}}
				/>

				<GalleryPreviewSheet
					uploads={gallery.items.map((item) => item.upload)}
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpen(false)}
				/>
			</TypeContainer>
		);
	},
	function GalleryFallback({
		transactionEntry,
	}: {
		transactionEntry: Pick<TransactionEntryGallery.Type, "direction">;
	}) {
		return (
			<TypeContainer
				direction={transactionEntry.direction}
				ui={{
					tone: "neutral",
					theme: "light",
					background: "default",
				}}
				className={"h-48"}
			>
				<SpinnerContainer />
			</TypeContainer>
		);
	},
);
