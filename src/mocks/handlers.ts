import { http, HttpResponse } from 'msw';

const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

export const handlers = [
  http.get(`${endpoint}auth/v1/token?grant_type=refresh_token`, () => {
    return new HttpResponse('Not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }),
];
