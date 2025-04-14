export interface PostRequestBody {
  title: string;
  body: string;
  userId: number;
}

export interface PostResponseBody extends PostRequestBody {
  id: number;
}
