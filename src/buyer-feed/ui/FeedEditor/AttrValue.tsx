import type { FC } from "react";
import { match, P } from "ts-pattern";
import type { AttrWhereSchema } from "~/buyer-listing/schema/AttrWhereSchema";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumberFn } from "~/number/fn/toLocaleNumberFn";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { Icon } from "~/ui/ui/Icon";
import { Typo } from "~/ui/ui/Typo";
import { ValueList } from "~/ui/ui/ValueList";
import type { CategoryAttrOfSchema } from "~/user-category/schema/CategoryAttrOfSchema";
import type { useView } from "~/view/hook/useView";

export namespace AttrValue {
	export interface Props {
		field: CategoryAttrOfSchema.Type;
		attr: AttrWhereSchema.Type | undefined;
		view: useView.Use<any>;
	}
}

export const AttrValue: FC<AttrValue.Props> = ({ field, attr, view }) => {
	const translator = useTranslator();
	const locale = useLocale();

	return match({
		field,
		attr,
	})
		.with(
			{
				field: {
					type: "enum-single",
				},
				attr: P.union(
					{
						type: "enum-single",
					},
					undefined,
				),
			},
			{
				field: {
					type: "enum-multi",
				},
				attr: P.union(
					{
						type: "enum-multi",
					},
					undefined,
				),
			},
			({ field, attr }) => {
				return (
					<Group>
						<ValueList
							textLabel={translator.textFn(`Field - ${field.name}`)}
							textEmpty={translator.textFn("No value here (label)")}
							items={
								attr?.value?.map((id) => ({
									id,
								})) ?? []
							}
							renderFn={({ id }) => {
								return translator.textFn(`${field.name} - ${id}`, id);
							}}
							onClick={() => {
								view.setFn(`attr.${field.name}`);
							}}
						/>
					</Group>
				);
			},
		)
		.with(
			{
				field: {
					type: "number",
				},
				attr: P.union(
					{
						type: "number",
					},
					undefined,
				),
			},
			{
				field: {
					type: "decimal",
				},
				attr: P.union(
					{
						type: "decimal",
					},
					undefined,
				),
			},
			({ field, attr }) => {
				return (
					<Group
						data-ui-tone={"neutral"}
						data-ui-theme={"light"}
						data-ui-background={"default"}
					>
						<Tx
							label={`Field - ${field.name} - number range`}
							data-ui-display={"block"}
							data-ui-width={"full"}
							data-ui-inner={"default"}
							data-ui-text={"sm"}
							data-ui-color={"lead"}
						/>

						<Container
							data-ui-flow={"horizontal"}
							data-ui-items={"center"}
							data-ui-justify={"space-evenly"}
							data-ui-width={"full"}
							data-ui-inner={"default"}
						>
							<Typo
								label={
									attr?.min
										? toLocaleNumberFn({
												locale,
												number: attr.min,
											})
										: translator.textFn("No from value here (label)")
								}
								onClick={() => {
									view.setFn(`attr.${field.name}.min`);
								}}
								data-ui-display={"block"}
							/>

							<Icon
								icon={ArrowRightIcon}
								data-ui-text={"xl"}
								data-ui-opacity={"5"}
							/>

							<Typo
								label={
									attr?.max
										? toLocaleNumberFn({
												locale,
												number: attr.max,
											})
										: translator.textFn("No to value here (label)")
								}
								onClick={() => {
									view.setFn(`attr.${field.name}.max`);
								}}
								data-ui-display={"block"}
							/>
						</Container>
					</Group>
				);
			},
		)
		.with(
			{
				field: {
					type: "year",
				},
				attr: P.union(
					{
						type: "year",
					},
					undefined,
				),
			},
			({ field, attr }) => {
				return (
					<Group
						data-ui-tone={"neutral"}
						data-ui-theme={"light"}
						data-ui-background={"default"}
					>
						<Tx
							label={`Field - ${field.name} - range year`}
							data-ui-display={"block"}
							data-ui-width={"full"}
							data-ui-inner={"default"}
							data-ui-text={"sm"}
							data-ui-color={"lead"}
						/>

						<Container
							data-ui-flow={"horizontal"}
							data-ui-items={"center"}
							data-ui-justify={"space-evenly"}
							data-ui-width={"full"}
							data-ui-inner={"default"}
						>
							<Typo
								label={attr?.min ?? translator.textFn("No from value here (label)")}
								onClick={() => {
									view.setFn(`attr.${field.name}.min`);
								}}
								data-ui-display={"block"}
							/>

							<Icon
								icon={ArrowRightIcon}
								data-ui-text={"xl"}
								data-ui-opacity={"5"}
							/>

							<Typo
								label={attr?.max ?? translator.textFn("No to value here (label)")}
								onClick={() => {
									view.setFn(`attr.${field.name}.max`);
								}}
								data-ui-display={"block"}
							/>
						</Container>
					</Group>
				);
			},
		)
		.with(
			{
				field: {
					type: "range",
				},
				attr: P.union(
					{
						type: "range",
					},
					undefined,
				),
			},
			({ field, attr }) => {
				return (
					<Group
						data-ui-tone={"neutral"}
						data-ui-theme={"light"}
						data-ui-background={"default"}
					>
						<Tx
							label={`Field - ${field.name} - range`}
							data-ui-display={"block"}
							data-ui-width={"full"}
							data-ui-inner={"default"}
							data-ui-text={"sm"}
							data-ui-color={"lead"}
						/>

						<Container
							data-ui-flow={"horizontal"}
							data-ui-items={"center"}
							data-ui-justify={"space-evenly"}
							data-ui-width={"full"}
							data-ui-inner={"default"}
						>
							<Typo
								label={
									attr?.min
										? toLocaleNumberFn({
												locale,
												number: attr.min,
											})
										: translator.textFn("No from value here (label)")
								}
								onClick={() => {
									view.setFn(`attr.${field.name}.min`);
								}}
								data-ui-display={"block"}
							/>

							<Icon
								icon={ArrowRightIcon}
								data-ui-text={"xl"}
								data-ui-opacity={"5"}
							/>

							<Typo
								label={
									attr?.max
										? toLocaleNumberFn({
												locale,
												number: attr.max,
											})
										: translator.textFn("No to value here (label)")
								}
								onClick={() => {
									view.setFn(`attr.${field.name}.max`);
								}}
								data-ui-display={"block"}
							/>
						</Container>
					</Group>
				);
			},
		)
		.with(
			{
				field: {
					type: "text",
				},
				attr: P.union(
					{
						type: "text",
					},
					undefined,
				),
			},
			{
				field: {
					type: "text",
				},
				attr: P.union(
					{
						type: "text",
					},
					undefined,
				),
			},
			() => {
				return null;
			},
		)
		.otherwise(() => {
			return null;
		});
};
