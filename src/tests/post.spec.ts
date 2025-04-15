/* eslint-disable ordered-imports/ordered-imports */
import { customRequestBody, customPostRequest, invalidRequest } from '../utils/helping-functions';
import * as types from 'src/types/types';

const BASE_URL: string = process.env.BASE_URL!;
let postId: number;

describe('creating a post', () => {
  // TESTING THE WHOLE REQUEST
  // positive
  describe('given a valid request body', () => {
    it('should return post object with matching field values', async () => {
      const response = await fetch(BASE_URL, customPostRequest());
      expect(response.ok).toBe(true);
      
      const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;

      expect(typeof responseBody.id).toBe('number');
      postId = responseBody.id;
      const expectedResponseBody = {
        id: postId,
        ...customRequestBody(),
      };
      expect(responseBody).toEqual(expectedResponseBody);
    });

    describe('sent twice', () => {
      it('should return post object with unique id', async () => {
        const response = await fetch(BASE_URL, customPostRequest());
        expect(response.ok).toBe(true);
        
        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        expect(responseBody.id).not.toEqual(postId);
      });
    });
    
    describe('sent the second time with the same data', () => {
      it('should return post object with id from the first response incremented by 1', async () => {
        const response = await fetch(BASE_URL, customPostRequest());
        expect(response.ok).toBe(true);
        
        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        expect(responseBody.id).toEqual(postId + 1);
      });
    });

    describe('with duplicated fields', () => {
      it('should return post object with the last field value', async () => {
        const invalidBody = '{"title":"first","title":"last","body":"bar","userId":1,}';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
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
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
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
    
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    // TESTING HEADERS
    describe('with uppercase headers', () => {
      it('should return post object with matching fields', async () => {
        const request = {
          method: 'POST',
          headers: { 'CONTENT-TYPE': 'APPLICATION/JSON; CHARSET=UTF-8' },
          body: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1,
          }),
        };
  
        const response = await fetch(BASE_URL, request);
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('without "Content-type" header', () => {
      it('should not return post object', async () => {
        const request = {
          method: 'POST',
          headers: {},
          body: JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1,
          }),
        };
    
        const response = await fetch(BASE_URL, request);
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    // negative for whole request
    describe('and id in URL', () => {
      it('should not return post object', async () => {
        const response = await fetch(`${BASE_URL}/1`, customPostRequest());
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

  describe('given invalid request body', () => {
    describe('in XML format', () => {
      it('should not return post object', async () => {
        const invalidBody = '<body><title>foo</title><body>bar</body><userId>1</userId></body>';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with trailing comma', () => {
      it('should not return post object', async () => {
        const invalidBody = '{"title":"foo","body":"bar","userId":1,}';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with missing comma between fields', () => {
      it('should not return post object', async () => {
        const invalidBody = '{"title":"foo""body":"bar","userId":1}';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with single quotes', () => {
      it('should not return post object', async () => {
        const invalidBody = `{'title':'foo','body':'bar','userId':1}`;
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with missing quotes on keys', () => {
      it('should not return post object', async () => {
        const invalidBody = '{title:"foo",body:"bar",userId:1}';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with malformed json', () => {
      it('should not return post object', async () => {
        const invalidBody = `{title:foo,useriD,body:bar}`;
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with key without a value', () => {
      it('should not return post object', async () => {
        const invalidBody = '{"title","body":"bar","userId":1}';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

    describe('with empty body', () => {
      it('should not return post object', async () => {
        const invalidBody = '';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
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

  // TESTING FIELDS
  describe('given valid values:', () => {
    describe('with spaces inside a string', () => {
      it('should return post object with matching values', async () => {
        const currentValue = 'ba ba ba';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('with leading and trailing spaces', () => {
      it('should return post object with matching values', async () => {
        const currentValue = '   ba ba ba     ';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('with letters of different case', () => {
      it('should return post object with matching values', async () => {
        const currentValue = 'Ba Ba Ba';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('of minimum length: 0 characters', () => {
      it('should return post object with matching values', async () => {
        const currentValue = '';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('of 1 character', () => {
      it('should return post object with matching values', async () => {
        const currentValue = 'a';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('of 9999 characters', () => {
      it('should return post object with matching values', async () => {
        const currentValue = 'a'.repeat(9999);
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('with punctuation characters', () => {
      it('should return post object with matching values', async () => {
        const currentValue = '.,;:!?\'"-()[]{}';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('with special characters', () => {
      it('should return post object with matching values', async () => {
        const currentValue = '@ # $ % ^ & * ~ | \ / < >';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });

    describe('with arabic lettes', () => {
      it('should return post object with matching values', async () => {
        const currentValue = 'مرحبًا بالعالم';
        const requestBody = customRequestBody(currentValue);
  
        const response = await fetch(BASE_URL, customPostRequest(requestBody));
        expect(response.ok).toBe(true);

        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          ...customRequestBody(),
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });
    });
  });

  describe('without title field', () => {
    it('should not return post object', async () => {
      const invalidBody = '{"body":"bar","userId":1,}';
      const request = invalidRequest(invalidBody);
  
      const response = await fetch(BASE_URL, request);
      expect(response.ok).toBe(false);

      const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
      postId = responseBody.id;
      const expectedResponseBody = {
        id: postId,
        body: 'bar',
        userId: 1,
      };
      expect(responseBody).toEqual(expectedResponseBody);
    });

    describe('without body field', () => {
      it('should not return post object', async () => {
        const invalidBody = '{"title":"bar","userId":1,}';
        const request = invalidRequest(invalidBody);
    
        const response = await fetch(BASE_URL, request);
        expect(response.ok).toBe(false);
  
        const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
        postId = responseBody.id;
        const expectedResponseBody = {
          id: postId,
          title: 'bar',
          userId: 1,
        };
        expect(responseBody).toEqual(expectedResponseBody);
      });

      describe('without userId field', () => {
        it('should not return post object', async () => {
          const invalidBody = '{"title":"bar","body":1,}';
          const request = invalidRequest(invalidBody);
      
          const response = await fetch(BASE_URL, request);
          expect(response.ok).toBe(false);
    
          const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
          postId = responseBody.id;
          const expectedResponseBody = {
            id: postId,
            title: 'bar',
            body: 1,
          };
          expect(responseBody).toEqual(expectedResponseBody);
        });
      });
    });
  });
});

describe('sending GET request with body instead of POST', () => {
  it('should not return post object', async () => {
    const request = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
    };

    const response = await fetch(BASE_URL, request);
    expect(response.ok).toBe(false);
  });
});

describe('sending DELETE request with body instead of POST', () => {
  it('should not delete and return post object', async () => {
    const request = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
    };

    const response = await fetch(BASE_URL, request);
    expect(response.ok).toBe(false);
  });
});
