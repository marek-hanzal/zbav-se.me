import { useState } from "react";
import type { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { toTimeDiff } from "@/lib/common/time";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { GalleryPreviewSheet } from "~/common/gallery/ui/GalleryPreviewSheet";
import { HeroImage } from "~/common/ui/img";
import { withTransactionEntryGalleryFetchQuery } from "~/user/transaction-entry/query/withTransactionEntryGalleryFetchQuery";
import type { TransactionEntryGallery } from "~/user/transaction-entry/server/schema/TransactionEntrySchema/GallerySchema";
import { TypeContainer } from "./TypeContainer";

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
				data-ui={"Gallery"}
				direction={transactionEntry.direction}
				data-ui-position="relative"
				data-ui-theme={undefined}
				data-ui-background={undefined}
				data-ui-round={undefined}
				data-ui-inner={undefined}
				className={"h-48"}
				{...props}
			>
				<HeroImage
					src={hero.url}
					visible
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-background="default"
					data-ui-round="default"
					onClick={() => setIsGalleryOpen((prev) => !prev)}
				/>

				<Typo
					label={toTimeDiff({
						locale,
						time: transactionEntry.createdAt,
						type: "relative",
					})}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-background="default"
					data-ui-text="sm"
					data-ui-round="default"
					data-ui-inner="default"
					data-ui-opacity="8"
					data-ui-snap-to="bottom-left"
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
				data-ui={"Gallery"}
				direction={transactionEntry.direction}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-background="default"
				className={"h-48"}
			>
				<SpinnerContainer />
			</TypeContainer>
		);
	},
);
