import {
	type ChangeEvent,
	type KeyboardEvent,
	type RefObject,
	useCallback,
	useRef,
	useState,
} from "react";
import type { AccessEnumSchema } from "~/access/schema/AccessEnumSchema";
import { withUploadMutation } from "~/user-upload/mutation/withUploadMutation";
import { withUploadQuery } from "~/user-upload/query/withUploadQuery";
import type { UploadSchema } from "~/user-upload/schema/UploadSchema";

export namespace useController {
	export type Value = string | undefined;
	export type OnChangeFn = (uploadId: Value) => void;
	export type OnUploadFn = (upload: UploadSchema.Type | undefined) => void;

	export interface Props {
		onChangeFn: OnChangeFn;
		access: AccessEnumSchema.Type;
		onUploadFn?: OnUploadFn;
		mutationId?: string;
	}

	export interface Result {
		inputRef: RefObject<HTMLInputElement | null>;
		progress: number;
		isPending: boolean;
		pickFn(): void;
		onKeyDownFn(e: KeyboardEvent): void;
		onUploadFn(e: ChangeEvent<HTMLInputElement>): Promise<void>;
	}
}

export function useController({
	onChangeFn,
	access,
	onUploadFn,
	mutationId,
}: useController.Props): useController.Result {
	const inputRef = useRef<HTMLInputElement>(null);
	const [progress, setProgressFn] = useState(0);
	const setUploadFn = withUploadQuery.useUpdate();

	const pickFn = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const onKeyDownFn = useCallback((e: KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			inputRef.current?.click();
		}
	}, []);

	const uploadMutation = withUploadMutation.useMutation({
		meta: {
			mutationId,
		},
		async onPreMutationFn() {
			setProgressFn(0);
		},
		async onPostMutationFn({ result }) {
			setUploadFn(result);
			onChangeFn(result.id);
			onUploadFn?.(result);
		},
	});

	return {
		inputRef,
		progress,
		isPending: uploadMutation.isPending,
		pickFn,
		onKeyDownFn,
		onUploadFn: useCallback(
			async (e: ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0];
				if (!file) {
					return;
				}

				uploadMutation.mutate({
					access,
					blob: file,
					name: file.name,
					onProgressFn: setProgressFn,
				});

				e.target.value = "";
			},
			[
				access,
				uploadMutation,
			],
		),
	} as const;
}
