import { withSessionQuery } from "~/user/auth/query/withSessionQuery";

export const useUser = () => {
	const { data: session } = withSessionQuery.useSuspenseQuery("No input data here, bro!");

	if (!session?.user) {
		throw new Error("Session not found");
	}

	return session.user;
};
