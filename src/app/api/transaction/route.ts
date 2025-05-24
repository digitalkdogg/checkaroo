import { NextResponse, NextRequest } from 'next/server'
import { GetDBSettings, createConnection} from '@/common/common'


export async function GET(request: NextRequest) {

    try {
        const connection = await createConnection()
        let get_query = ''
        let transid = request.nextUrl!.searchParams!.get('transid')!;

        var qry = {
          select : '*',
          from : 'Transactions',
          where: ''
        }

        if (transid) {
             qry.where = 'account_id = "1" && trans_id = "' + transid + '"' 
        } else {
             qry.where = 'account_id = "1"'
        }

        get_query = 'select ' + qry.select + ' from ' + qry.from

        if (qry.where != '') {
            get_query = get_query + ' where ' +qry.where
        }

        const [results] = await connection.connection.query(get_query)

        connection.connection.end()

        return NextResponse.json({results})
  
  } catch (err) {

    const response = {
      error: (err as Error).message,
     returnedStatus: 401,
    }
    return NextResponse.json(response, { status: 401 })
 }
}