import { NextResponse, NextRequest } from 'next/server'
import {select, deleteRec} from '@/common/dbutils'
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

    const id = decrypt(json.id)

    if (!id) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    try {
        const selectQuery = {
            select : '*',
            from : 'Transactions',
            where : 'account_id = "' + accountid + '" and category_id="'  + id + '"'
        }

         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dotransexist = await select(selectQuery).then((res:any)=> {
            if (res.length >0) {
                return true;
            }
            return false
        }).catch((err:Err)=>{
            throw new Error(err.message)
        }) 

        if (dotransexist == false ) {
            const deleteQuery = {
                from : 'Category',
                where: 'account_id = "' + accountid + '" and category_id="'  + id + '"',
                limit: 1
            }

            const delRec = await deleteRec(deleteQuery)
            if (delRec) {
                return NextResponse.json({message: 'Category Removed Successfully'})
            }
        } else {
            return NextResponse.json({message: 'Category is tied to one or more transactions'})
        }
        
    
    } catch (err:unknown) {
        return NextResponse.json({message: err, 'status': 'error'}, {status: 444})
    }

return NextResponse.json({})
}