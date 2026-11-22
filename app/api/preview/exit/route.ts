import { NextResponse } from 'next/server'
export function GET(request: Request) {
  const result = NextResponse.redirect(new URL('/', request.url))
  const secure = new URL(request.url).protocol === 'https:'
  result.headers.append('Set-Cookie', 'yovo_studio_preview=; Path=/; Max-Age=0; HttpOnly; ' + (secure ? 'Secure; SameSite=None; Partitioned' : 'SameSite=Lax'))
  result.headers.set('Cache-Control', 'private, no-store')
  return result
}
