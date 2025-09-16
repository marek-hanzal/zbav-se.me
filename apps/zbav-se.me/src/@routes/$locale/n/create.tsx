import { createFileRoute } from "@tanstack/react-router";
import { ColumnLayout } from "@use-pico/client";
import { useCallback, useState } from "react";
import type { PhotoSlot } from "~/app/listing/ui/CreateListing/Photos/PhotoSlot";
import { PhotosWrapper } from "~/app/listing/ui/CreateListing/Photos/PhotosWrapper";
import { Nav } from "~/app/ui/nav/Nav";

export const Route = createFileRoute("/$locale/n/create")({
	component() {
		const photoCountLimit = 10;

		const [photos, setPhotos] = useState<PhotoSlot.Value[]>(
			Array.from(
				{
					length: photoCountLimit,
				},
				() => null,
			),
		);
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

		return (
			<ColumnLayout layout="content-footer">
				{/* <CreateListing photoCountLimit={10} /> */}

				<PhotosWrapper
					count={photoCountLimit}
					value={photos}
					onChange={onChangePhotos}
				/>

				<Nav active="create" />
			</ColumnLayout>
		);
	},
});
