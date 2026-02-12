import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { DraftEditor } from "~/app/@seller-user/draft/ui/DraftEditor";

export const Route = createFileRoute("/$locale/flow/seller/draft/$id/edit")({
	component() {
		const { id } = Route.useParams();
		const locale = useLocale();
		const navigate = Route.useNavigate();

		return (
			<withDraftFetchQuery.Suspense
				data={{
					where: {
						id,
					},
				}}
				fallback={<SpinnerContainer />}
			>
				{({ data }) => (
					<DraftEditor
						draft={data}
						onListing={async () => {
							await navigate({
								to: "/$locale/ui/seller/listing/my",
								params: {
									locale,
								},
							});
						}}
						onDelete={async () => {
							await navigate({
								to: "/$locale/flow/home",
								params: {
									locale,
								},
							});
						}}
					/>
				)}
			</withDraftFetchQuery.Suspense>
		);
	},
});
