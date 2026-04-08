import { useMessageMutation } from "~/user/assistant-chat/mutation/useMessageMutation";

export namespace useAssistantChat {
	export type UseResult = ReturnType<typeof useAssistantChat>;
}

export const useAssistantChat = () => {
	const mutation = useMessageMutation();

	return {
		messages: mutation.messages,
		mutation,
	};
};
