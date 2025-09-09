import { createFileRoute } from "@tanstack/react-router";
import { Button, FormField, LinkTo, Tx } from "@use-pico/client";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";

export const Route = createFileRoute("/$locale/order/demand/create")({
	component() {
		const { data: list } = withCategoryGroupListQuery().useSuspenseQuery({
			sort: [
				{
					value: "sort",
					sort: "asc",
				},
			],
		});

		return (
			<>
				{list.map((item) => (
					<Tx
						key={item.id}
						label={item.name}
					/>
				))}

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
