import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { useSnapperNav } from "@/lib/client/snapper";
import { SnapperNav } from "@/lib/client/snapper-nav";
import type { StateType } from "@/lib/client/type";
import { PhotoUpload } from "~/common/photo/ui/PhotoUpload";
import { Toolbar } from "./Toolbar";

export namespace GalleryUpload {
	export interface Props extends Container.Props {
		allowClear?: boolean;
		state: StateType.State<string[]>;
		limit: number;
	}
}

/**
 * Coordinates gallery file input and upload-ready state for the parent form.
 * Use it in editors where users attach media before publishing or saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const GalleryUpload: FC<GalleryUpload.Props> = ({ allowClear, state, limit, ...props }) => {
	const snapperRef = useRef<HTMLDivElement>(null);
	const snapperNav = useSnapperNav({
		containerRef: snapperRef,
		orientation: "horizontal",
		count: limit,
	});

	return (
		<Container
			data-ui={"GalleryUpload-[Container]"}
			data-ui-position="relative"
			data-ui-height="full"
			{...props}
		>
			<SnapperNav
				data-ui={"GalleryUpload-[SnapperNav]"}
				snapperNav={snapperNav}
			/>

			<Container
				data-ui={"GalleryUpload-[Container.photos]"}
				ref={snapperRef}
				data-ui-layout="horizontal-full"
				data-ui-snap="horizontal"
				data-ui-snap-align="center"
				data-ui-gap="default"
				data-ui-height="full"
				data-ui-round="default"
			>
				{Array.from({
					length: limit,
				}).map((_, slot) => {
					const uploadId = state.value[slot];
					const canDelete = allowClear || state.value.length > 1;
					const previousUploadId = state.value[slot - 1];
					const nextUploadId = state.value[slot + 1];
					const disabled = slot > 0 && !state.value[slot - 1];

					return (
						<Container
							key={`${
								// biome-ignore lint/suspicious/noArrayIndexKey: We're ok here, bro
								slot + 1
							}`}
							data-ui={"GalleryUpload-[Container.photo]"}
							data-ui-position="relative"
							data-ui-width="full"
							data-ui-height="full"
						>
							<PhotoUpload
								value={uploadId}
								onChange={(nextUploadId) => {
									state.set((prev) => {
										const next: (string | undefined)[] = [
											...prev,
										];
										next[slot] = nextUploadId;

										return next.filter((f): f is string => !!f);
									});
								}}
								data-ui-disabled={disabled}
							/>

							{uploadId ? (
								<Toolbar
									canDelete={canDelete}
									canMoveLeft={!!previousUploadId}
									canMoveRight={!!nextUploadId}
									hooks={{
										onDelete() {
											state.set((prev) => {
												return prev.filter((_, index) => index !== slot);
											});
										},
										onMoveLeft() {
											if (!previousUploadId) {
												return;
											}

											state.set((prev) => {
												const next = [
													...prev,
												];
												next[slot - 1] = uploadId;
												next[slot] = previousUploadId;

												return next.filter((f): f is string => !!f);
											});
										},
										onMoveRight() {
											if (!nextUploadId) {
												return;
											}

											state.set((prev) => {
												const next = [
													...prev,
												];
												next[slot] = nextUploadId;
												next[slot + 1] = uploadId;

												return next.filter((f): f is string => !!f);
											});
										},
									}}
								/>
							) : null}
						</Container>
					);
				})}
			</Container>
		</Container>
	);
};
