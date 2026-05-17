import type { FC } from "react";
import { match, P } from "ts-pattern";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { ArrowRightIcon, Icon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { Typo } from "@/lib/client/typo";
import { ValueList } from "@/lib/client/value";
import type { useView } from "@/lib/client/view";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import type { AttrWhereSchema } from "~/buyer/listing/server/schema/AttrWhereSchema";
import type { CategoryAttrOfSchema } from "~/user/category/server/schema/CategoryAttrOfSchema";

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
							textLabel={translator.text(`Field - ${field.name}`)}
							textEmpty={translator.text("No value here (label)")}
							items={
								attr?.value?.map((id) => ({
									id,
								})) ?? []
							}
							renderFn={({ id }) => {
								return translator.text(`${field.name} - ${id}`, id);
							}}
							onClick={() => {
								view.set(`attr.${field.name}`);
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
										? toLocaleNumber({
												locale,
												number: attr.min,
											})
										: translator.text("No from value here (label)")
								}
								onClick={() => {
									view.set(`attr.${field.name}.min`);
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
										? toLocaleNumber({
												locale,
												number: attr.max,
											})
										: translator.text("No to value here (label)")
								}
								onClick={() => {
									view.set(`attr.${field.name}.max`);
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
								label={attr?.min ?? translator.text("No from value here (label)")}
								onClick={() => {
									view.set(`attr.${field.name}.min`);
								}}
								data-ui-display={"block"}
							/>

							<Icon
								icon={ArrowRightIcon}
								data-ui-text={"xl"}
								data-ui-opacity={"5"}
							/>

							<Typo
								label={attr?.max ?? translator.text("No to value here (label)")}
								onClick={() => {
									view.set(`attr.${field.name}.max`);
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
										? toLocaleNumber({
												locale,
												number: attr.min,
											})
										: translator.text("No from value here (label)")
								}
								onClick={() => {
									view.set(`attr.${field.name}.min`);
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
										? toLocaleNumber({
												locale,
												number: attr.max,
											})
										: translator.text("No to value here (label)")
								}
								onClick={() => {
									view.set(`attr.${field.name}.max`);
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
