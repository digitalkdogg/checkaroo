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

    interface Trans {
        length: number
    }

    if (!headersLegit(request, ['trans/add', 'trans/dets', 'categories/add', 'categories/dets'])) {
        writelog(request.toString(), '----------invalid request get-----------')
        return NextResponse.json({ error: 'Unauthorized request' }, { status: 401 })
    }

    const json = await request.json()
    const session: string = json.session

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized Session' }, { status: 401 })
    }

    const accountid = await getAccountIDSession(session)

    if (!accountid) {
        return NextResponse.json({ error: 'Unauthorized Account' }, { status: 401 })
    }

    const id = JSON.parse(decrypt(json.data)).catid
    
    if (!id) {
        return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    try {
        const transactions = await select({
            select: '*',
            from: 'Transactions',
            where: `account_id = "${accountid}" AND category_id = "${id}"`
        }) as Trans[]

        const categoryHasTransactions = transactions.length > 0

        if (categoryHasTransactions) {
            return NextResponse.json({
                message: 'Category is tied to one or more transactions',
                status: 'error'
            })
        }

        const deleted = await deleteRec({
            from: 'Category',
            where: `account_id = "${accountid}" AND category_id = "${id}"`,
            limit: 1
        })

        if (deleted) {
            return NextResponse.json({
                message: 'Category Removed Successfully',
                status: 'success'
            })
        }

        return NextResponse.json({
            message: 'Category could not be deleted',
            status: 'error'
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error'
        return NextResponse.json({ message, status: 'error' }, { status: 444 })
    }
}