import {
	type ChangeEvent,
	type KeyboardEvent,
	type RefObject,
	useCallback,
	useRef,
	useState,
} from "react";
import type { PhotoUpload } from "~/@common/photo/ui/PhotoUpload";
import { withUploadMutation } from "~/@user/upload/mutation/withUploadMutation";
import { withUploadFetchQuery } from "~/@user/upload/query/withUploadFetchQuery";

export namespace useController {
	export interface Props {
		value: PhotoUpload.Value;
		onChange: PhotoUpload.OnChangeFn;
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

export function useController({ value, onChange }: useController.Props): useController.Result {
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
		},
	});

	const onUpload = useCallback(
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
	);

	return {
		inputRef,
		progress,
		isPending: uploadMutation.isPending,
		pick,
		onKeyDown,
		onUpload,
	} as const;
}
