import { useUser } from "~/app/@common/auth/hook/useUser";

export const useSide = () => {
	return useUser().side;
};
