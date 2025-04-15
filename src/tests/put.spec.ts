/* eslint-disable ordered-imports/ordered-imports */
import * as types from '../types/types';
import { customPostRequest, customPutRequest } from '../utils/helping-functions';

const BASE_URL: string = process.env.BASE_URL!;
let existingId: number;

describe('updating post', () => {
  describe('by existing id', () => {
    beforeAll(async () => {
      const response = await fetch(BASE_URL, customPostRequest());

      const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
      existingId = responseBody.id;
    });

    describe('with valid body', () => {
      describe('containing all fields', () => {
        it('should return updated post object with matching field values', async () => {
          const requestBody = {
            title: `title-${Date.now()}`,
            body: `body-${Date.now()}`,
            userId: `userId-${Date.now()}`,
          };
          const response = await fetch(`${BASE_URL}/${existingId}`, customPutRequest(requestBody));
          expect(response.ok).toBe(true);
              
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            ...requestBody,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });

      describe('containing all fields except title', () => {
        it('should return updated post object with matching field values', async () => {
          const requestBody = {
            body: `body-${Date.now()}`,
            userId: `userId-${Date.now()}`,
          };
          const response = await fetch(`${BASE_URL}/${existingId}`, customPutRequest(requestBody));
          expect(response.ok).toBe(true);
                
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            ...requestBody,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });

      describe('containing all fields except body', () => {
        it('should return updated post object with matching field values', async () => {
          const requestBody = {
            title: `title-${Date.now()}`,
            userId: `userId-${Date.now()}`,
          };
          const response = await fetch(`${BASE_URL}/${existingId}`, customPutRequest(requestBody));
          expect(response.ok).toBe(true);
                  
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            ...requestBody,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });

      describe('containing all fields except userId', () => {
        it('should return updated post object with matching field values', async () => {
          const requestBody = {
            title: `title-${Date.now()}`,
            body: `body-${Date.now()}`,
          };
          const response = await fetch(`${BASE_URL}/${existingId}`, customPutRequest(requestBody));
          expect(response.ok).toBe(true);
                    
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            ...requestBody,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });
    });
  });

  describe('by non-existing valid id', () => {
    it('should not return post', async () => {
      const nonExistingId = existingId + 1;
      const requestBody = {
        title: `title-${Date.now()}`,
        body: `body-${Date.now()}`,
        userId: `userId-${Date.now()}`,
      };

      const response = await fetch(`${BASE_URL}/${nonExistingId}`, customPutRequest(requestBody));
      expect(response.ok).toBe(false);

      let responseBody;
      try {
        responseBody = await response.json();
      } catch (error) {
        responseBody = null;
      }
      expect(responseBody).toBeNull();
    });    
  });

  describe('by ivalid id', () => {
    describe('containing string', () => {
      it('should not return post', async () => {
        const invalidId = 'one';
        const requestBody = {
          title: `title-${Date.now()}`,
          body: `body-${Date.now()}`,
          userId: `userId-${Date.now()}`,
        };
      
        const response = await fetch(`${BASE_URL}/${invalidId}`, customPutRequest(requestBody));
        expect(response.ok).toBe(false);
      
        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });    
    });

    describe('containing zero', () => {
      it('should not return post', async () => {
        const invalidId = 0;
        const requestBody = {
          title: `title-${Date.now()}`,
          body: `body-${Date.now()}`,
          userId: `userId-${Date.now()}`,
        };
        
        const response = await fetch(`${BASE_URL}/${invalidId}`, customPutRequest(requestBody));
        expect(response.ok).toBe(false);
        
        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });    
    });

    describe('containing negative number', () => {
      it('should not return post', async () => {
        const invalidId = -1;
        const requestBody = {
          title: `title-${Date.now()}`,
          body: `body-${Date.now()}`,
          userId: `userId-${Date.now()}`,
        };
        
        const response = await fetch(`${BASE_URL}/${invalidId}`, customPutRequest(requestBody));
        expect(response.ok).toBe(false);
        
        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });    
    });

    describe('containing decimal', () => {
      it('should not return post', async () => {
        const invalidId = 1.3;
        const requestBody = {
          title: `title-${Date.now()}`,
          body: `body-${Date.now()}`,
          userId: `userId-${Date.now()}`,
        };
          
        const response = await fetch(`${BASE_URL}/${invalidId}`, customPutRequest(requestBody));
        expect(response.ok).toBe(false);
          
        let responseBody;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }
        expect(responseBody).toBeNull();
      });    
    });

    describe('containing long number', () => {
      it('should not return post', async () => {
        const invalidId = 100000000000022;
        const requestBody = {
          title: `title-${Date.now()}`,
          body: `body-${Date.now()}`,
          userId: `userId-${Date.now()}`,
        };
          
        const response = await fetch(`${BASE_URL}/${invalidId}`, customPutRequest(requestBody));
        expect(response.ok).toBe(false);
          
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

  describe('without id in URL', () => {
    it('should not return post', async () => {
      const requestBody = {
        title: `title-${Date.now()}`,
        body: `body-${Date.now()}`,
        userId: `userId-${Date.now()}`,
      };
        
      const response = await fetch(BASE_URL, customPutRequest(requestBody));
      expect(response.ok).toBe(false);
        
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
