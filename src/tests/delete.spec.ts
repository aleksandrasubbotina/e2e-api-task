/* eslint-disable ordered-imports/ordered-imports */
import * as types from '../types/types';
import { PostRequest } from '../utils/helping-functions';

const BASE_URL: string = process.env.BASE_URL!;
let existingId: number;

describe('deleting a post', () => {
  beforeEach(async () => {
    const response = await fetch(BASE_URL, PostRequest());

    const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
    existingId = responseBody.id;
  });

  // positive
  describe('given valid post id', () => {
    it('should return 204 status code and no data, post is deleted', async () => {
      const deleteResponse = await fetch(`${BASE_URL}/${existingId}`, { method: 'DELETE' });
      expect(deleteResponse.status).toBe(204);

      let responseBody;
      try {
        responseBody = await deleteResponse.json();
      } catch (error) {
        responseBody = null;
      }
      expect(responseBody).toBeNull();

      const getResponse = await fetch(`${BASE_URL}/${existingId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should not affect previous post', async () => {
      const response = await fetch(BASE_URL, PostRequest());

      const responseBody: types.ResponseBody = await response.json() as types.ResponseBody;
      const nextPostId = responseBody.id;
    
      const deleteResponse = await fetch(`${BASE_URL}/${nextPostId}`, { method: 'DELETE' });
      expect(deleteResponse.status).toBe(204);

      const getResponse = await fetch(`${BASE_URL}/${existingId}`);
      expect(getResponse.ok).toBe(true);
    });

    it('should not delete a post twice', async () => {
      const deleteResponse = await fetch(`${BASE_URL}/${existingId}`, { method: 'DELETE' });
      expect(deleteResponse.status).toBe(204);
      
      const anotherDeleteResponse = await fetch(`${BASE_URL}/${existingId}`, { method: 'DELETE' });
      expect(anotherDeleteResponse.status).toBe(404);
    });
  });

  // negative
  describe('given non-existing post id', () => {
    it('should return 404', async () => {
      const response = await fetch(`${BASE_URL}/007`, { method: 'DELETE' });
      expect(response.status).toBe(404);
    });
  });

  describe('given invalid post id:', () => {
    describe('10 digits', () => {
      it('should return 404', async () => {
        const response = await fetch(`${BASE_URL}/9999999999`, { method: 'DELETE' });
        expect(response.status).toBe(404);
      });
    });

    describe('zero', () => {
      it('should return 404', async () => {
        const response = await fetch(`${BASE_URL}/0`, { method: 'DELETE' });
        expect(response.status).toBe(404);
      });
    });

    describe('negative number', () => {
      it('should return 404', async () => {
        const response = await fetch(`${BASE_URL}/-3`, { method: 'DELETE' });
        expect(response.status).toBe(404);
      });
    });

    describe('decimal', () => {
      it('should return 404', async () => {
        const response = await fetch(`${BASE_URL}/-7`, { method: 'DELETE' });
        expect(response.status).toBe(404);
      });
    });


    describe('letters', () => {
      it('should return 404', async () => {
        const response = await fetch(`${BASE_URL}/three`, { method: 'DELETE' });
        expect(response.status).toBe(404);
      });
    });

    describe('special characters', () => {
      it('should return 404', async () => {
        const response = await fetch(`${BASE_URL}/#`, { method: 'DELETE' });
        expect(response.status).toBe(404);
      });
    });
  });
});
