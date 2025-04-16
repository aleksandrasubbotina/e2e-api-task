/* eslint-disable ordered-imports/ordered-imports */
import * as types from '../types/types';
import { PostRequest, PutRequest, invalidPutRequest } from '../utils/helping-functions';

const BASE_URL: string = process.env.BASE_URL!;
let existingId: number;
let updatedBody: types.RequestBody;

describe('updating post', () => {
  // positive
  describe('by existing id', () => {
    beforeAll(async () => {
      const response = await fetch(BASE_URL, PostRequest());

      const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
      existingId = responseBody.id;
    });

    describe('with valid body', () => {
      describe('containing all fields', () => {
        it('should return updated post object with matching field values', async () => {
          updatedBody = {
            title: `title-${Date.now()}`,
            body: `body-${Date.now()}`,
            userId: `userId-${Date.now()}`,
          };
          const response = await fetch(`${BASE_URL}/${existingId}`, PutRequest(updatedBody));
          expect(response.ok).toBe(true);
              
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            ...updatedBody,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });

      describe('sent the second time with the same data', () => {
        it('should return unchanged post object with id from the first response', async () => {
          const response = await fetch(`${BASE_URL}/${existingId}`, PutRequest(updatedBody));
          expect(response.ok).toBe(true);
              
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            ...updatedBody,
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
          const response = await fetch(`${BASE_URL}/${existingId}`, PutRequest(requestBody));
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
          const response = await fetch(`${BASE_URL}/${existingId}`, PutRequest(requestBody));
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
          const response = await fetch(`${BASE_URL}/${existingId}`, PutRequest(requestBody));
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

      describe('with duplicated fields', () => {
        it('should return post object with the last field value', async () => {
          const invalidBody = '{"title":"first","title":"last","body":"bar","userId":1,}';
          const request = invalidPutRequest(invalidBody);
          
          const response = await fetch(`${BASE_URL}/${existingId}`, request);
          expect(response.ok).toBe(true);
      
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            title: 'last',
            body: 'bar',
            userId: 1,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });
      
      describe('with extra fields', () => {
        it('should return post object without the extra field', async () => {
          const invalidBody = '{"title":"foo","body":"bar","userId":1,"rating":100500}';
          const request = invalidPutRequest(invalidBody);
          
          const response = await fetch(`${BASE_URL}/${existingId}`, request);
          expect(response.ok).toBe(true);
      
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          const postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            title: 'foo',
            body: 'bar',
            userId: 1,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });
      
      describe('with fields in different order', () => {
        it('should return post object with matching field values', async () => {
          const requestBody = {
            body: 'Test body',
            userId: 1,
            title: 'Test title',
          };
          
          const response = await fetch(`${BASE_URL}/${existingId}`, PutRequest(requestBody));
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

  //negative
  describe('by non-existing valid id', () => {
    it('should not return post', async () => {
      const nonExistingId = existingId + 1;
      const requestBody = {
        title: `title-${Date.now()}`,
        body: `body-${Date.now()}`,
        userId: `userId-${Date.now()}`,
      };

      const response = await fetch(`${BASE_URL}/${nonExistingId}`, PutRequest(requestBody));
      expect(response.ok).toBe(true);

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
      
        const response = await fetch(`${BASE_URL}/${invalidId}`, PutRequest(requestBody));
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
        
        const response = await fetch(`${BASE_URL}/${invalidId}`, PutRequest(requestBody));
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
        
        const response = await fetch(`${BASE_URL}/${invalidId}`, PutRequest(requestBody));
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
          
        const response = await fetch(`${BASE_URL}/${invalidId}`, PutRequest(requestBody));
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
          
        const response = await fetch(`${BASE_URL}/${invalidId}`, PutRequest(requestBody));
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
        
      const response = await fetch(BASE_URL, PutRequest(requestBody));
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
