import { type FC, useRef } from "react";
import { Container } from "@/lib/client/container";
import { useSnapperNav } from "@/lib/client/snapper";
import { SnapperNav } from "@/lib/client/snapper-nav";
import type { StateType } from "@use-pico/common/type";
import { PhotoUpload } from "~/common/photo/ui/PhotoUpload";

export namespace GalleryUpload {
	export interface Props extends Container.Props {
		state: StateType.State<string[]>;
		limit: number;
	}
}

/**
 * Coordinates gallery file input and upload-ready state for the parent form.
 * Use it in editors where users attach media before publishing or saving.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const GalleryUpload: FC<GalleryUpload.Props> = ({ state, limit, ...props }) => {
	const snapperRef = useRef<HTMLDivElement>(null);
	const snapperNav = useSnapperNav({
		containerRef: snapperRef,
		orientation: "horizontal",
		count: limit,
	});

	return (
		<Container
			data-ui={"GalleryUpload-[Container]"}
			ui={{
				position: "relative",
				height: "full",
			}}
			{...props}
		>
			<SnapperNav
				data-ui={"GalleryUpload-[SnapperNav]"}
				snapperNav={snapperNav}
			/>

			<Container
				data-ui={"GalleryUpload-[Container.photos]"}
				ref={snapperRef}
				ui={{
					layout: "horizontal-full",
					snap: "horizontal",
					snapAlign: "center",
					gap: "default",
					height: "full",
					round: "default",
				}}
			>
				{Array.from({
					length: limit,
				}).map((_, slot) => {
					const disabled = slot > 0 && !state.value[slot - 1];

					return (
						<PhotoUpload
							key={`${
								// biome-ignore lint/suspicious/noArrayIndexKey: We're ok here, bro
								slot + 1
							}`}
							value={state.value[slot]}
							onChange={(uploadId) => {
								state.set((prev) => {
									const next: (string | undefined)[] = [
										...prev,
									];
									next[slot] = uploadId;

									const compact: string[] = next.filter((f): f is string => !!f);

									return compact;
								});
							}}
							ui={{
								disabled,
							}}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
