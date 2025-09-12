import { ls } from "@use-pico/client";
import type { Cls } from "@use-pico/cls";
import { translator } from "@use-pico/common";
import { driver } from "driver.js";
import {
	type FC,
	useCallback,
	useEffect,
	useId,
	useMemo,
	useState,
} from "react";
import type { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";
import { SendPackageIcon } from "~/app/ui/icon/SendPackageIcon";
import { TagIcon } from "~/app/ui/icon/TagIcon";
import { Snapper } from "~/app/ui/snapper/Snapper";
import { SnapperContent } from "~/app/ui/snapper/SnapperContent";
import { SnapperItem } from "~/app/ui/snapper/SnapperItem";
import { SnapperNav } from "~/app/ui/snapper/SnapperNav";
import type { TitleCls } from "~/app/ui/title/TitleCls";
import { PhotosWrapper } from "./CreateListing/Photos/PhotosWrapper";
import { PriceWrapper } from "./CreateListing/Price/PriceWrapper";
import { SubmitWrapper } from "./CreateListing/Submit/SubmitWrapper";
import { TagsWrapper } from "./CreateListing/Tags/TagsWrapper";

const subtitleVariant: Cls.VariantsOf<TitleCls> = {
	tone: "secondary",
	size: "lg",
};

export namespace CreateListing {
	export interface Props {
		photoCountLimit: number;
	}
}

export const CreateListing: FC<CreateListing.Props> = ({ photoCountLimit }) => {
	const photosId = useId();
	const tagsId = useId();
	const priceId = useId();
	const submitId = useId();

	const [photos, setPhotos] = useState<PhotoSlot.Value[]>(
		Array.from(
			{
				length: photoCountLimit,
			},
			() => null,
		),
	);

	const hasPhotos = useMemo(() => {
		return photos.some((p) => p !== null);
	}, [
		photos,
	]);

	const canSubmit = useMemo(() => {
		if (!hasPhotos) {
			return false;
		}

		return true;
	}, [
		hasPhotos,
	]);

	const onChangePhotos: PhotoSlot.OnChangeFn = useCallback(
		(file, slot) => {
			setPhotos((prev) => {
				const next = [
					...prev,
				];
				next[slot] = file;

				const compact: PhotoSlot.Value[] = next.filter(
					(f): f is File => f !== null,
				);

				while (compact.length < photoCountLimit) {
					compact.push(null);
				}

				return compact;
			});
		},
		[
			photoCountLimit,
		],
	);

	useEffect(() => {
		const intro = ls.get("intro.listing");

		if (intro) {
			return;
		}

		const drv = driver({
			showProgress: true,
			animate: true,
			overlayClickBehavior: "nextStep",
			stageRadius: 10,
			disableActiveInteraction: true,
			nextBtnText: translator.text("Next (tour)"),
			prevBtnText: translator.text("Previous (tour)"),
			doneBtnText: translator.text("Done (tour)"),
			progressText: translator.text("Progress (tour)"),
			steps: [
				{
					element: `#${photosId}`,
					popover: {
						title: translator.text("Listing - Photos (tour)"),
						description: translator.text(
							"Listing - Photos (description)",
						),
					},
				},
				{
					element: `#${tagsId}`,
					popover: {
						title: translator.text("Listing - Tags (tour)"),
						description: translator.text(
							"Listing - Tags (description)",
						),
					},
				},
				{
					element: `#${priceId}`,
					popover: {
						title: translator.text("Listing - Price (tour)"),
						description: translator.text(
							"Listing - Price (description)",
						),
					},
				},
				{
					element: `#${submitId}`,
					popover: {
						title: translator.text("Listing - Submit (tour)"),
						description: translator.text(
							"Listing - Submit (description)",
						),
					},
				},
			],
			onDestroyed() {
				ls.set("intro.listing", true);
			},
		});

		drv.drive();

		return () => {
			drv.destroy();
		};
	}, [
		photosId,
		tagsId,
		priceId,
		submitId,
	]);

	return (
		<Snapper orientation="vertical">
			<SnapperNav
				pages={[
					{
						id: photosId,
						icon: hasPhotos ? CheckIcon : PhotoIcon,
						iconProps: hasPhotos
							? {
									tone: "primary",
								}
							: undefined,
					},
					{
						id: tagsId,
						icon: TagIcon,
					},
					{
						id: priceId,
						icon: PriceIcon,
					},
					{
						id: submitId,
						icon: SendPackageIcon,
					},
				]}
			/>

			<SnapperContent>
				<SnapperItem>
					<PhotosWrapper
						count={photoCountLimit}
						value={photos}
						onChange={onChangePhotos}
					/>
				</SnapperItem>

				<SnapperItem>
					<TagsWrapper subtitleVariant={subtitleVariant} />
				</SnapperItem>

				<SnapperItem>
					<PriceWrapper subtitleVariant={subtitleVariant} />
				</SnapperItem>

				<SnapperItem>
					<SubmitWrapper canSubmit={canSubmit} />
				</SnapperItem>
			</SnapperContent>
		</Snapper>
	);
};
