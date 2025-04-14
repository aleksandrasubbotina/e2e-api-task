import { PostRequestBody } from '../types/post.types';

export const postBody: PostRequestBody = {
  title: 'foo',
  body: 'bar',
  userId: 1,
};

export const postRequest = {
  method: 'POST',
  body: JSON.stringify(postBody),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
};
