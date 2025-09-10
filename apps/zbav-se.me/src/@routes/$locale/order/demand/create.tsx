import { createFileRoute } from "@tanstack/react-router";
import {
	Badge,
	Button,
	Data,
	FormField,
	LinkTo,
	More,
	Tx,
} from "@use-pico/client";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";

export const Route = createFileRoute("/$locale/order/demand/create")({
	component() {
		const categoryGroupListQuery = withCategoryGroupListQuery().useQuery({
			sort: [
				{
					value: "sort",
					sort: "asc",
				},
			],
		});

		return (
			<>
				<Data<CategoryGroupSchema.Type[], typeof categoryGroupListQuery>
					result={categoryGroupListQuery}
					renderSuccess={({ data }) => (
						<More
							limit={10}
							items={data}
							renderItem={({ entity }) => (
								<Badge
									size={"lg"}
									key={entity.id}
								>
									{entity.name}
								</Badge>
							)}
							renderInline={({ entity }) => (
								<Badge
									size={"lg"}
									key={entity.id}
								>
									{entity.name}
								</Badge>
							)}
						/>
					)}
				/>

				<Tx
					label={"Create Demand"}
					theme={"dark"}
					tone={"primary"}
					size={"xl"}
				/>

				<LinkTo
					to="/$locale/order/supply/create"
					params={{
						locale: "en",
					}}
				>
					<Button
						theme="dark"
						tone="secondary"
					>
						Bla
					</Button>
				</LinkTo>

				<LinkTo
					to="/$locale"
					params={{
						locale: "en",
					}}
				>
					root
				</LinkTo>

				<form>
					<FormField label={"label"} />
				</form>
			</>
		);
	},
});
