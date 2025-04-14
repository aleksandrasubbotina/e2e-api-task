import { isPostResponseBody } from '../../utils/response-validator';
import { postBody, postRequest } from '../api/post.request';

const BASE_URL: string = process.env.BASE_URL!;
let validId: number;

describe('getting a post', () => {
  beforeAll(async () => {
    const response = await fetch(BASE_URL, postRequest);

    if (!response.ok) {
      throw new Error(`Failed to create new post: ${response.status} status`);
    }
    const responseBody = await response.json();

    if (isPostResponseBody(responseBody)) {
      validId = responseBody.id;
    } else {
      throw new Error('Invalid response body structure');
    }
  });
  

  // positive
  describe('given valid post id', () => {
    it('should not return post object with correct data', async () => {
      const response = await fetch(`${BASE_URL}/${validId}`);

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      if (!isPostResponseBody(responseBody)) {
        throw new Error('Invalid response body structure');
      }

      expect(responseBody.id).toBe(validId);
      expect(responseBody.userId).toBe(postBody.userId);
      expect(responseBody.title).toBe(postBody.title);
      expect(responseBody.userId).toBe(postBody.userId);
    });

    it('should not affect initial post data', async () => {
      const response = await fetch(`${BASE_URL}/${validId}`);
      expect(response.status).toBe(200);
      
      const responseBody = await response.json();
      if (!isPostResponseBody(responseBody)) {
        throw new Error('Invalid response body structure');
      }

      expect(responseBody.id).toBe(validId);
      expect(responseBody.userId).toBe(postBody.userId);
      expect(responseBody.title).toBe(postBody.title);
      expect(responseBody.userId).toBe(postBody.userId);
    });
  });

  // negative
  describe('given non-existing post id', () => {
    it('should not return post object', async () => {
      const response = await fetch(`${BASE_URL}/007`);
      expect(response.status).toBe(404);

      const body = await response.json();
      expect(body).toEqual({});
    });
  });

  describe('given invalid post id', () => {
    describe('containing 10 digits', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/999999999999999999999999`);
        expect(response.status).toBe(404);

        const body = await response.json();
        expect(body).toEqual({});
      });
    });

    describe('containing zero', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/0`);
        expect(response.status).toBe(404);

        const body = await response.json();
        expect(body).toEqual({});
      });
    });

    describe('containing negative number', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/-1`);
        expect(response.status).toBe(404);

        const body = await response.json();
        expect(body).toEqual({});
      });
    });


    describe('containing letters', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/abc`);
        expect(response.status).toBe(404);

        const body = await response.json();
        expect(body).toEqual({});
      });
    });

    describe('containing special characters', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/&##`);
        expect(response.status).toBe(404);

        const body = await response.json();
        expect(body).toEqual({});
      });
    });
  });
});
