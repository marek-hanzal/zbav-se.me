import { withSessionQuery } from "~/app/@common/auth/query/withSessionQuery";

export const useUser = () => {
	const { data: session } = withSessionQuery.useSuspenseQuery();

	if (!session.data) {
		throw new Error("Session not found");
	}

	return session.data.user;
};
