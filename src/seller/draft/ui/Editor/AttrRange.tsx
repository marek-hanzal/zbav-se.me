import { type FC, useMemo } from "react";
import { match, P } from "ts-pattern";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import type { useView } from "@/lib/client/view";
import { clamp } from "@/lib/common/clamp";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";
import { withDraftAttrDecimalPatchMutation } from "~/seller/draft-attr-decimal/mutation/withDraftAttrDecimalPatchMutation";
import type { DraftAttrOfSchema } from "~/user/draft-attr/server/schema/DraftAttrOfSchema";
import { useNextAttr } from "./useNextAttr";

const toNumericBound = (value: number | null | undefined, fallback: number) => {
	return match(value)
		.with(P.number, (value) => (Number.isNaN(value) ? fallback : value))
		.otherwise(() => fallback);
};

export namespace AttrRange {
	export interface Props extends Container.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: Extract<
			DraftAttrOfSchema.Type,
			{
				type: "range";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrRange: FC<AttrRange.Props> = ({ draftId, attrs, attr, view, ...props }) => {
	const locale = useLocale();
	const next = useNextAttr(attr, attrs);
	const mutation = withDraftAttrDecimalPatchMutation.useMutation({
		onSuccess() {
			view.set(next ? `attr.${next.name}` : "default");
		},
	});
	const { min, max, step, schema } = useMemo(() => {
		const min = toNumericBound(attr.min, 0);
		const max = Math.max(min, toNumericBound(attr.max, min + 100));
		const step = Math.max(0.01, toNumericBound(attr.step, 1));

		return {
			min,
			max,
			step,
			schema: z
				.looseObject({
					value: z.number().min(min).max(max),
				})
				.strip(),
		} as const;
	}, [
		attr.min,
		attr.max,
		attr.step,
	]);
	const form = useAppForm({
		defaultValues: {
			value: typeof attr.value === "number" ? clamp(attr.value, min, max) : min,
		},
		validators: {
			onMount: schema,
			onChange: schema,
			onBlur: schema,
			onSubmit: schema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				fieldId: attr.name,
				draftId,
				value: value.value,
			});
		},
	});

	return (
		<Container
			data-ui={"AttrRange"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<form.AppField name={"value"}>
				{(field) => {
					const value = field.state.value ?? min;
					const progress = ((value - min) / Math.max(max - min, step)) * 100;

					return (
						<Container
							data-ui-gap="lg"
							data-ui-height="full"
							data-ui-layout="vertical-centered"
							data-ui-inner={"2xl"}
						>
							<Typo
								data-ui={"AttrRange-Typo-value"}
								label={toLocaleNumber({
									locale,
									number: value,
								})}
								data-ui-text="xl"
								data-ui-font="semibold"
							/>

							<Container
								data-ui={"AttrRange-Slider"}
								data-ui-gap="default"
								data-ui-width="full"
								data-ui-tone={"primary"}
								data-ui-theme={"light"}
								data-ui-color={"lead"}
							>
								<input
									type={"range"}
									min={min}
									max={max}
									step={step}
									value={value}
									onChange={(event) => {
										field.handleChange(Number.parseFloat(event.target.value));
									}}
									onBlur={field.handleBlur}
									className={[
										"h-3",
										"w-full",
										"cursor-pointer",
										"appearance-none",
										"rounded-full",
										"[&::-webkit-slider-runnable-track]:h-3",
										"[&::-webkit-slider-runnable-track]:rounded-full",
										"[&::-webkit-slider-thumb]:-mt-2",
										"[&::-webkit-slider-thumb]:h-7",
										"[&::-webkit-slider-thumb]:w-7",
										"[&::-webkit-slider-thumb]:appearance-none",
										"[&::-webkit-slider-thumb]:rounded-full",
										"[&::-webkit-slider-thumb]:border",
										"[&::-webkit-slider-thumb]:border-(--color-border)",
										"[&::-webkit-slider-thumb]:bg-(--color-bg)",
										"[&::-webkit-slider-thumb]:shadow-lg",
										"[&::-moz-range-track]:h-3",
										"[&::-moz-range-track]:rounded-full",
										"[&::-moz-range-thumb]:h-7",
										"[&::-moz-range-thumb]:w-7",
										"[&::-moz-range-thumb]:rounded-full",
										"[&::-moz-range-thumb]:border",
										"[&::-moz-range-thumb]:border-(--color-border)",
										"[&::-moz-range-thumb]:bg-(--color-bg)",
									].join(" ")}
									style={{
										background: `linear-gradient(to right, var(--color-lead) 0%, var(--color-lead) ${progress}%, var(--color-border) ${progress}%, var(--color-border) 100%)`,
									}}
								/>

								<Container
									data-ui-flow="horizontal"
									data-ui-justify="space-between"
									data-ui-items="center"
									data-ui-width="full"
								>
									<Typo
										data-ui={"AttrRange-Typo-min"}
										label={toLocaleNumber({
											locale,
											number: min,
										})}
										data-ui-color="icon"
									/>
									<Typo
										data-ui={"AttrRange-Typo-max"}
										label={toLocaleNumber({
											locale,
											number: max,
										})}
										data-ui-color="icon"
									/>
								</Container>
							</Container>
						</Container>
					);
				}}
			</form.AppField>

			<form.Subscribe
				selector={(state) => ({
					isValid: state.isValid,
					isSubmitting: state.isSubmitting,
				})}
			>
				{({ isValid, isSubmitting }) => (
					<SaveContainer
						onCancel={() => {
							view.set("default");
						}}
						onSave={() => {
							form.handleSubmit();
						}}
						loading={isSubmitting}
						disabled={!isValid || isSubmitting}
						textSave={<Tx label={"Continue (label)"} />}
						textCancel={<Tx label={"Back (label)"} />}
						saveProps={{
							iconEnabled: ArrowRightIcon,
							iconPosition: "right",
						}}
					/>
				)}
			</form.Subscribe>
		</Container>
	);
};
