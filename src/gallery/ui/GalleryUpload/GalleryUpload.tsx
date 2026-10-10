import { type FC, useRef } from "react";
import type { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import { Toolbar } from "~/gallery/ui/GalleryUpload/Toolbar";
import { useSnapperNav } from "~/navigation/hook/useSnapperNav";
import { SnapperNav } from "~/navigation/ui/SnapperNav";
import { PhotoUpload } from "~/photo/ui/PhotoUpload/index";
import type { StateType } from "~/ui/type/StateType";
import { Container } from "~/ui/ui/Container";

export namespace GalleryUpload {
	export interface Props extends Container.Props {
		allowClear?: boolean;
		state: StateType.State<string[]>;
		limit: number;
		access: AccessEnumSchema.Type;
		mutationId?: string;
	}
}

/**
 * Coordinates gallery file input and upload-ready state for the parent form.
 * Use it in editors where users attach media before publishing or saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const GalleryUpload: FC<GalleryUpload.Props> = ({
	allowClear,
	state,
	limit,
	access,
	mutationId,
	...props
}) => {
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
								access={access}
								mutationId={mutationId}
								onChangeFn={(nextUploadId) => {
									state.setFn((prev) => {
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
										onDeleteFn() {
											state.setFn((prev) => {
												return prev.filter((_, index) => index !== slot);
											});
										},
										onMoveLeftFn() {
											if (!previousUploadId) {
												return;
											}

											state.setFn((prev) => {
												const next = [
													...prev,
												];
												next[slot - 1] = uploadId;
												next[slot] = previousUploadId;

												return next.filter((f): f is string => !!f);
											});
										},
										onMoveRightFn() {
											if (!nextUploadId) {
												return;
											}

											state.setFn((prev) => {
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
