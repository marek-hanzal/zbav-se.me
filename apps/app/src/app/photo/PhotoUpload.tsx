import { SpinnerIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { Progress } from "@use-pico/client/ui/progress";
import { Status } from "@use-pico/client/ui/status";
import { withUploadMutation } from "@zbav-se.me/sdk/mutation/user";
import { withUploadFetchQuery } from "@zbav-se.me/sdk/query/user";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { Sheet } from "@zbav-se.me/ui/sheet";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	useCallback,
	useRef,
	useState,
} from "react";

export namespace PhotoUpload {
	export type Value = string | undefined;
	export type OnChangeFn = (uploadId: Value) => void;

	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		camera?: boolean;
		value: Value;
		onChange: OnChangeFn;
	}
}

export const PhotoUpload: FC<PhotoUpload.Props> = ({
	camera = false,
	value,
	onChange,
	tweak,
	disabled,
	...props
}) => {
	const [current, setCurrent] = useState<string | undefined>(value);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
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
						id: current,
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
			setCurrent(result.id);
			onChange(result.id);
		},
	});

	const uploadFetchQuery = withUploadFetchQuery.useQuery(
		{
			where: {
				id: current,
			},
		},
		{
			enabled: !!current && !uploadMutation.isPending,
		},
	);

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

	return (
		<Container
			ref={containerRef}
			ui="PhotoUpload-Container"
			position="relative"
		>
			<input
				data-ui="PhotoUpload-Input"
				ref={inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={onUpload}
			/>

			<Sheet
				ui="PhotoUpload-Sheet"
				onClick={pick}
				onKeyDown={onKeyDown}
				disabled={disabled || uploadMutation.isPending}
				tweak={[
					tweak,
					{
						slot: {
							root: {
								class: [
									/**
									 * Because of internal <img/> uses absolute sizes.
									 */
									"relative",
								],
							},
						},
					},
				]}
				{...props}
			>
				{uploadMutation.isPending ? (
					<Status
						icon={SpinnerIcon}
						textTitle={"Uploading photo (title)"}
						tone={"primary"}
						theme={"light"}
						action={
							<Progress
								value={progress * 100}
								size={"lg"}
								tone={"primary"}
								theme={"dark"}
							/>
						}
					/>
				) : (
					<Data
						result={uploadFetchQuery}
						renderEmpty={() => {
							return (
								<Status
									icon={PhotoIcon}
									iconProps={{
										size: "2xl",
									}}
									textTitle={"Upload (title)"}
									titleProps={{
										size: "2xl",
									}}
									textMessage={
										disabled
											? "Upload - disabled (placeholder)"
											: "Listing - upload photo (placeholder)"
									}
									messageProps={{
										size: "xl",
									}}
									tone={"primary"}
								/>
							);
						}}
						renderSuccess={({ data }) => (
							<img
								src={data.url}
								alt={data.id}
								className="absolute inset-0 h-full w-full object-cover object-center"
							/>
						)}
					/>
				)}
			</Sheet>

			{/* 
        If you bring back the "trash" action, also clear the cache to avoid flash:
        setUpload(undefined, { where: { id: value } });
      */}
		</Container>
	);
};
