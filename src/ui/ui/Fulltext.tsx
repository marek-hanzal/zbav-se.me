import { useDebouncedCallback } from "@tanstack/react-pacer";
import { type ComponentProps, type FC, useRef, useState } from "react";
import { uiInputFn } from "~/form/fn/uiInputFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { uiFulltextFn } from "~/ui/fn/uiFulltextFn";
import { useMergeRefs } from "~/ui/hook/useMergeRefs";
import type { StateType } from "~/ui/type/StateType";
import { Icon } from "~/ui/ui/Icon";

export namespace Fulltext {
	export type Value = string | undefined;
	export type State = StateType.State<Value>;
	export type OnFulltext = (text: Value) => void;

	export interface Props extends uiFulltextFn.Component<ComponentProps<"input">> {
		state: State;
		textPlaceholder?: string;
		/**
		 * When true, adds a submit button instead of using debounce
		 */
		withSubmit?: boolean;
		/**
		 * Minimum number of characters required to submit (default: 3)
		 */
		limit?: number;
	}
}

export const Fulltext: FC<Fulltext.Props> = ({
	ref,
	state: { value = "", setFn },
	textPlaceholder,
	withSubmit = false,
	limit = 3,
	className,
	...props
}) => {
	const translator = useTranslator();
	const inputRef = useRef<HTMLInputElement>(null);
	const mergeRef = useMergeRefs([
		ref,
		inputRef,
	]);
	const [search, setSearchFn] = useState(value || "");
	const debouncedFn = useDebouncedCallback(setFn, {
		wait: 500,
	});

	const isDisabled = withSubmit && search.length < limit;

	const handleSubmitFn = () => {
		if (isDisabled) {
			return;
		}
		inputRef.current?.blur();
		setFn(search);
	};

	return (
		<div
			{...uiFulltextFn({
				className,
			})}
		>
			<Icon
				icon={"icon-[material-symbols-light--search]"}
				data-ui-text="xl"
				className={[
					"absolute",
					"left-2",
					"top-1/2",
					"-translate-y-1/2",
					"pointer-events-none",
				]}
			/>

			<input
				ref={mergeRef}
				value={search}
				type={"text"}
				placeholder={textPlaceholder ?? translator.textFn("Fulltext (placeholder)")}
				onChange={(event) => {
					setSearchFn(event.target.value);
					if (event.target.value === "") {
						setFn("");
					}
					if (!withSubmit) {
						debouncedFn(event.target.value);
					}
				}}
				onKeyDown={(event) => {
					if (withSubmit && event.key === "Enter") {
						handleSubmitFn();
					}
				}}
				{...uiInputFn({
					className: [
						"px-8",
						className,
					],
				})}
				data-ui="Fulltext-input"
				{...props}
			/>
			{withSubmit ? (
				<div
					data-ui="Fulltext-submit"
					className="Fulltext-submit absolute inset-y-0 right-2 flex items-center cursor-pointer"
				>
					<Icon
						icon={"icon-[lucide--send]"}
						onClick={handleSubmitFn}
						className={
							isDisabled
								? [
										"opacity-25",
										"cursor-not-allowed",
									]
								: [
										"opacity-50",
										"hover:opacity-75",
										"cursor-pointer",
									]
						}
						data-ui-tone="neutral"
						data-ui-text="sm"
					/>
				</div>
			) : (
				value && (
					<div
						data-ui="Fulltext-clear"
						className="Fulltext-clear absolute inset-y-0 right-2 flex items-center cursor-pointer"
					>
						<Icon
							icon={"icon-[gridicons--cross]"}
							onClick={() => {
								setSearchFn("");
								setFn(undefined);
								inputRef.current?.focus();
							}}
							data-ui-tone="secondary"
							data-ui-text="sm"
						/>
					</div>
				)
			)}
		</div>
	);
};
