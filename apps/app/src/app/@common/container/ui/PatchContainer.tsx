import { Container } from "@use-pico/client/ui/container";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC, PropsWithChildren } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";

const innerUi = {
	layout: "vertical-content-footer",
	height: "full",
	width: "full",
	inner: "default",
	gap: "default",
} as const;

export namespace PatchContainer {
	export interface Props extends Container.Props, PropsWithChildren {
		onCancel(): void;
		onSave(): void;
		loading: boolean;
		disabled: boolean;
		/** When set, wraps content in TitleContainer with this title (draft-style). */
		title?: string;
	}
}

/**
 * Shared layout for patch screens: content area + SaveContainer footer.
 * Use with direct domain query mutations (e.g. withFeedQuery/withDraftQuery). Pass title for draft-style header.
 */
export const PatchContainer: FC<PatchContainer.Props> = ({
	children,
	onCancel,
	onSave,
	loading,
	disabled,
	title,
	ui,
	...containerProps
}) => {
	const footer = (
		<SaveContainer
			onCancel={onCancel}
			onSave={onSave}
			loading={loading}
			disabled={disabled}
		/>
	);

	if (title) {
		return (
			<TitleContainer
				textTitle={title}
				ui={ui}
				{...containerProps}
			>
				<Container ui={innerUi}>
					{children}
					{footer}
				</Container>
			</TitleContainer>
		);
	}

	return (
		<Container
			ui={{
				...innerUi,
				...ui,
			}}
			{...containerProps}
		>
			{children}
			{footer}
		</Container>
	);
};
