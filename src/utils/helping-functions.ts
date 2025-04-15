import * as postTypes from '../types/types';

const validHeaders = {
  'Content-type': 'application/json; charset=UTF-8',
};

const validTitle = 'foo';
const validBody = 'bar';
const validUserId = 1;

export function customRequestBody(testingData?: string | number): postTypes.RequestBody {
  return {
    title: testingData ?? validTitle,
    body: testingData ?? validBody,
    userId: testingData ?? validUserId,
  };
}

export function customRequest(body = customRequestBody()): postTypes.Request {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  };
}

export function invalidRequest(body: string, headers = validHeaders): postTypes.Request {
  return {
    method: 'POST',
    body: body,
    headers: headers,
  };
}

export function isPostResponseBody(obj: unknown): obj is postTypes.ResponseBody {
  if (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'title' in obj &&
    'body' in obj &&
    'userId' in obj
  ) {
    const post = obj as {
      id: unknown;
      title: unknown;
      body: unknown;
      userId: unknown;
    };

    return (
      typeof post.id === 'number' &&
      typeof post.title === 'string' &&
      typeof post.body === 'string' &&
      typeof post.userId === 'number'
    );
  }

  return false;
}
