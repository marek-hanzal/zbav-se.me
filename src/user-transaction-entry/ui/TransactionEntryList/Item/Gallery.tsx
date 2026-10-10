import { useState } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { toTimeDiffFn } from "~/date/fn/toTimeDiffFn";
import { getUploadFn } from "~/gallery/fn/getUploadFn";
import { GalleryPreviewSheet } from "~/gallery/ui/GalleryPreviewSheet";
import { useLocale } from "~/locale/hook/useLocale";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import type { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Typo } from "~/ui/ui/Typo";
import { withTransactionEntryGalleryFetchQuery } from "~/user-transaction-entry/query/withTransactionEntryGalleryFetchQuery";
import type { TransactionEntryGallery } from "~/user-transaction-entry/schema/TransactionEntryGallerySchema";
import { TypeContainer } from "~/user-transaction-entry/ui/TransactionEntryList/Item/TypeContainer";

export namespace Gallery {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionEntry: TransactionEntryGallery.Type;
	}
}

export const Gallery = withFallbackFn(
	({ _suspense, transactionEntry, ...props }: Gallery.Props) => {
		const locale = useLocale();
		const { data: gallery } = withTransactionEntryGalleryFetchQuery.useSuspenseQuery({
			where: {
				transactionEntryId: transactionEntry.id,
			},
		});
		const hero = getUploadFn(gallery.items.map(({ upload }) => upload.url));
		const [isGalleryOpen, setIsGalleryOpenFn] = useState(false);

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
					src={hero}
					visible
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-background="default"
					data-ui-round="default"
					onClick={() => setIsGalleryOpenFn((prev) => !prev)}
				/>

				<Typo
					label={toTimeDiffFn({
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
					urls={gallery.items.map((item) => item.upload.url)}
					isOpen={isGalleryOpen}
					onClose={() => setIsGalleryOpenFn(false)}
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
