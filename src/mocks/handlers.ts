import { rest } from 'msw';

const endpoint = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';

export const handlers = [
  rest.get(
    `${endpoint}auth/v1/token?grant_type=refresh_token`,
    (_req, res, ctx) => {
      return res(ctx.status(404));
    },
  ),
];
