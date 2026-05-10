import { type FC, Suspense } from "react";
import { Container } from "@/lib/client/container";
import { SpinnerIcon } from "@/lib/client/icon";
import { Progress } from "@/lib/client/progress";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translation";
import type { AccessEnumSchema } from "~/common/access/AccessEnumSchema";
import { Placeholder } from "./Placeholder";
import { Preview } from "./Preview";
import { useController } from "./useController";

const UploadPending: FC<{
	progress: number;
}> = ({ progress }) => {
	return (
		<Container
			data-ui={"PhotoUpload-[Container.spinner]"}
			data-ui-flow="vertical"
			data-ui-height="full"
			data-ui-items="center"
			data-ui-justify="center"
		>
			<Status
				data-ui={"PhotoUpload-[Status.spinner]"}
				icon={SpinnerIcon}
				textTitle={translator.text("Uploading photo (title)")}
				action={
					<Progress
						value={progress * 100}
						data-ui-size="lg"
						data-ui-tone="primary"
						data-ui-theme="dark"
					/>
				}
				data-ui-tone="primary"
				data-ui-theme="light"
			/>
		</Container>
	);
};

export namespace PhotoUpload {
	export interface Props extends Omit<Container.Props, "onChange"> {
		camera?: boolean;
		value: useController.Value;
		access: AccessEnumSchema.Type;
		onChange: useController.OnChangeFn;
		onUpload?: useController.OnUploadFn;
		mutationId?: string;
	}
}

/**
 * Coordinates photo file input and upload-ready state for the parent form.
 * Use it in editors where users attach media before publishing or saving.
 *
 * @see src/draft/ui/DraftEditor/DraftEditor.tsx
 */
export const PhotoUpload: FC<PhotoUpload.Props> = ({
	camera = false,
	value,
	access,
	onChange,
	onUpload,
	mutationId,
	"data-ui-disabled": dataUiDisabled,
	...props
}) => {
	const controller = useController({
		onChange,
		access,
		onUpload,
		mutationId,
	});
	const isDisabled = controller.isPending || dataUiDisabled || undefined;

	return (
		<Container
			data-ui={"PhotoUpload[Container]"}
			data-action={"pick photo"}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-round="default"
			data-ui-background="default"
			data-ui-border
			data-ui-shadow
			data-ui-position="relative"
			data-ui-disabled={isDisabled}
			data-ui-width="full"
			data-ui-height="full"
			onClick={controller.pick}
			onKeyDown={controller.onKeyDown}
			{...props}
		>
			<input
				data-ui="PhotoUpload-[Input]"
				data-action="upload photo"
				ref={controller.inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={controller.onUpload}
			/>

			{controller.isPending ? <UploadPending progress={controller.progress} /> : null}

			{!value && !controller.isPending ? <Placeholder disabled={isDisabled} /> : null}

			{value && !controller.isPending ? (
				<Suspense fallback={<Preview.Fallback />}>
					<Preview
						_suspense={"I know"}
						uploadId={value}
					/>
				</Suspense>
			) : null}
		</Container>
	);
};
