import { NextResponse, NextRequest } from 'next/server'
import {select, update} from '@/common/dbutils'
import {getAccountIDSession} from '@/common/session'
import {headersLegit} from '@/common/session'
import { writelog } from '@/common/logs'
import { decrypt } from '@/common/crypt'

export async function GET(request: NextRequest) {
    writelog(request.toString(), '----------invalid request get----------' )
    return NextResponse.json({ error: 'Unauthorized method' }, { status: 401 });
}

export async function POST(request: NextRequest) {

    interface Err {
        message? : string
    }

    if (!headersLegit(request, ['trans/add', 'trans/dets', 'categories/add', 'categories/dets'])) {
        writelog(request.toString(), '----------invalid request get-----------')
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 });
    }
  

    const json = await request.json();
    const session:string = json.session;

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 });
    }

    const accountid = await getAccountIDSession(session) 

    if (!accountid) {
      return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 });
    }

    const data = JSON.parse(decrypt(json.data))

    if (!data) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const selectQuery = {
        select : '*',
        from : 'Category',
        where : 'account_id = "' + accountid + '" and category_name="'  + data.catname + '"'
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docatexist = await select(selectQuery).then((res: any) => {
        if (res && res[0]) {
            if (res[0].category_id == data.catid) {
                return 'NoUpdate'
            }
            return 'true';
        } else {
            return 'false'
        }
    }).catch((err: Err) => {
        return null;
    });

   
    let results: string | undefined;

    if (docatexist =='false') {
        const updateQuery = {
            table: 'Category',
            fields : 'category_name="' + data.catname + '"',  
            where : 'account_id = "' + accountid + '"and category_id="' + data.catid + '"',
            limit: 1
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        results = await update(updateQuery).then((res: any) => {
            if (res) {
                return 'Category Update Successful'
            }
            return 'Error Update Category';
        }).catch((err: Err) => {
            return 'Error Updating Category';
        });
    } else {
        if (docatexist=='NoUpdate') {
            return NextResponse.json({})
        }
        return NextResponse.json({'message': 'Category already exists'}, {status: 444})
    }

   return NextResponse.json({message: results, status: results == 'Category Update Successful' ? true : false})

}