'use server'
import { NextResponse, NextRequest } from 'next/server'
import { getAccountIDSession} from '@/common/session'
import { headersLegit } from '@/common/session';
import { writelog } from '@/common/logs';

export async function GET(request: NextRequest) {
  writelog(request.toString(), '----------invalid request get-----------')
  return NextResponse.json({'results': {'err': {'message': 'Not Authorized'}}})
}

export async function POST(request: NextRequest) {
    try {
        if (!headersLegit(request, ['/login', '/trans/', '/clients/', '/categories/'])) {
            return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
        }

        const json = await request.json();
        const sessionstr:string = json.session;
        var session:any;

        if (!sessionstr) {
            return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
        }

        const accountid = await getAccountIDSession(sessionstr)
        if (!accountid) {
            return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
        } else {
            return NextResponse.json({ valid: true })
        }
    } catch(err) {
        return NextResponse.json({'error': err   })
    }
}