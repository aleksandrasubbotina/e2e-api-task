/* eslint-disable ordered-imports/ordered-imports */
import * as types from '../types/types';
import { customRequest, customRequestBody, isPostResponseBody } from '../utils/helping-functions';

const BASE_URL: string = process.env.BASE_URL!;
let validId: number;

describe('getting a post', () => {
  beforeAll(async () => {
    const response = await fetch(BASE_URL, customRequest());

    const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
    validId = responseBody.id;
  });

  // positive
  describe('given valid post id', () => {
    it('should return post object with correct data', async () => {
      const response = await fetch(`${BASE_URL}/${validId}`);
      expect(response.ok).toBe(true);

      const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
      const expectedResponseBody: types.ResponseBody = {
        id: validId,
        ...customRequestBody(),
      };
      expect(responseBody).toEqual(expectedResponseBody);
    });

    it('should not affect initial post data', async () => {
      const response = await fetch(`${BASE_URL}/${validId}`);
      expect(response.ok).toBe(true);
      
      const responseBody = await response.json();
      if (!isPostResponseBody(responseBody)) {
        throw new Error('Invalid response body structure');
      }
      const expectedResponseBody: types.ResponseBody = {
        id: validId,
        ...customRequestBody(),
      };
      expect(responseBody).toEqual(expectedResponseBody);
    });
  });

  // negative
  describe('given non-existing post id', () => {
    it('should not return post object', async () => {
      const response = await fetch(`${BASE_URL}/007`);
      expect(response.status).toBe(404);

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (error) {
        responseBody = null;
      }
      expect(responseBody).toBeNull();
    });
  });

  describe('given invalid post id:', () => {
    describe('10 digits', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/999999999999999999999999`);
        expect(response.status).toBe(404);

        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });
    });

    describe('zero', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/0`);
        expect(response.status).toBe(404);

        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();

        
      });
    });

    describe('negative number', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/-1`);
        expect(response.status).toBe(404);

        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });
    });

    describe('decimal', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/1.5`);
        expect(response.status).toBe(404);

        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });
    });


    describe('letters', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/abc`);
        expect(response.status).toBe(404);

        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });
    });

    describe('special characters', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/&##`);
        expect(response.status).toBe(404);

        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });
    });
  });
});
