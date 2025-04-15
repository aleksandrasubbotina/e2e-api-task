export interface RequestBody {
  title: string | number;
  body: string | number;
  userId: string | number;
}

export interface ResponseBody extends RequestBody {
  id: number;
}

export interface Request {
  method: string;
  body: string;
  headers: Record<string, string>;
}
