import { useLocale } from "@use-pico/client/hook";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { toTimeDiff } from "@use-pico/common/time";
import type { tTransactionEntryGallery } from "@zbav-se.me/sdk/api/user";
import { withGalleryFetchQuery } from "@zbav-se.me/sdk/query/user/gallery";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";
import { GalleryPreviewSheet } from "~/app/@common/gallery/ui/GalleryPreviewSheet";

export namespace TransactionEntryGallery {
	export interface Props extends Container.Props {
		transactionEntry: tTransactionEntryGallery;
	}
}

export const TransactionEntryGallery: FC<TransactionEntryGallery.Props> = ({
	transactionEntry,
	...props
}) => {
	const locale = useLocale();
	const { data: gallery } = withGalleryFetchQuery.useSuspenseQuery({
		where: {
			id: transactionEntry.payload.galleryId,
		},
	});
	const hero = useUpload(gallery.items);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);

	return (
		<Container
			ui={{
				position: "relative",
			}}
			className={[
				"w-2/3",
				"h-48",
				transactionEntry.direction === "out"
					? "ml-auto"
					: undefined,
				transactionEntry.direction === "system"
					? [
							"mx-auto",
							"text-center",
						]
					: undefined,
			]}
			{...props}
		>
			<HeroImage
				src={hero.url}
				visible
				ui={{
					theme: "light",
					background: "alt",
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
		</Container>
	);
};
