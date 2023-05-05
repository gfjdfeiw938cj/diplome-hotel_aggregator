interface GetChatListParams {
  user?: string | null;
  isActive: boolean;
  offset: number;
  limit: number;
}

export default GetChatListParams;
