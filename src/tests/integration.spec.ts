/* eslint-disable ordered-imports/ordered-imports */
import * as types from '../types/types';
import { PostRequest, PutRequest } from '../utils/helping-functions';

const BASE_URL: string = process.env.BASE_URL!;
let existingId: number;

const originalBody = {
  title: 'original title',
  body: 'original body',
  userId: 1,
};
  
const updatedBody = {
  title: 'updated title',
  body: 'updated body',
  userId: 1,
};

describe('post lifecycle integration test', () => {
  it('should create, retrieve, update, and delete a post correctly', async () => {
    const postResponse = await fetch(BASE_URL, PostRequest(originalBody));
    expect(postResponse.status).toBe(201);
  
    const postResponseBody: types.ResponseBody = await postResponse.json() as types.ResponseBody;
    existingId = postResponseBody.id;
    expect(postResponseBody).toMatchObject(originalBody);
  
    // GET
    const getResponse = await fetch(`${BASE_URL}/${existingId}`);
    const getResponseBody: types.ResponseBody = await getResponse.json() as types.ResponseBody;
    expect(getResponseBody).toMatchObject(originalBody);
  
    // PUT
    const putResponse = await fetch(`${BASE_URL}/${existingId}`, PutRequest(updatedBody));
    expect(putResponse.status).toBe(200);
  
    const putResponseBody: types.ResponseBody = await putResponse.json() as types.ResponseBody;
    expect(putResponseBody).toMatchObject(updatedBody);
  
    // GET again
    const getAfterUpdateResponse = await fetch(`${BASE_URL}/${existingId}`);
    const getAfterUpdateResponseBody: types.ResponseBody = await getAfterUpdateResponse.json() as types.ResponseBody;
    expect(getAfterUpdateResponseBody).toMatchObject(updatedBody);
  
    // DELETE
    const deleteResponse = await fetch(`${BASE_URL}/${existingId}`, {
      method: 'DELETE',
    });
    expect(deleteResponse.status).toBe(204);
  
    // GET again
    const getAfterDeleteResponse = await fetch(`${BASE_URL}/${existingId}`);
    expect(getAfterDeleteResponse.status).toBe(404);
  });
});
