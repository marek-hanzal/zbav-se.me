import {
	type ChangeEvent,
	type KeyboardEvent,
	type RefObject,
	useCallback,
	useRef,
	useState,
} from "react";
import { withUploadMutation } from "~/user/upload/mutation/withUploadMutation";
import { withUploadFetchQuery } from "~/user/upload/query/withUploadFetchQuery";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export namespace useController {
	export type Value = string | undefined;
	export type OnChangeFn = (uploadId: Value) => void;
	export type OnUploadFn = (upload: UploadSchema.Type | undefined) => void;

	export interface Props {
		value: Value;
		onChange: OnChangeFn;
		onUpload?: OnUploadFn;
	}

	export interface Result {
		inputRef: RefObject<HTMLInputElement | null>;
		progress: number;
		isPending: boolean;
		pick(): void;
		onKeyDown(e: KeyboardEvent): void;
		onUpload(e: ChangeEvent<HTMLInputElement>): Promise<void>;
	}
}

export function useController({
	value,
	onChange,
	onUpload,
}: useController.Props): useController.Result {
	const inputRef = useRef<HTMLInputElement>(null);
	const [progress, setProgress] = useState(0);
	const setUpload = withUploadFetchQuery.useSet();

	const pick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const onKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			inputRef.current?.click();
		}
	}, []);

	const uploadMutation = withUploadMutation.useMutation({
		async onPreMutation() {
			setProgress(0);

			setUpload(
				() => {
					return undefined;
				},
				{
					where: {
						id: value,
					},
				},
			);
		},
		async onPostMutation({ result }) {
			setUpload(() => result, {
				where: {
					id: result.id,
				},
			});
			onChange(result.id);
			onUpload?.(result);
		},
	});

	return {
		inputRef,
		progress,
		isPending: uploadMutation.isPending,
		pick,
		onKeyDown,
		onUpload: useCallback(
			async (e: ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (!file) {
					return;
				}

				uploadMutation.mutate({
					blob: file,
					name: file.name,
					onProgress: setProgress,
				});

				e.target.value = "";
			},
			[
				uploadMutation,
			],
		),
	} as const;
}
