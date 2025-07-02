 'use server';

import {select, insert} from '@/common/dbutils'
import { convertToMySQLDate } from '@/common/common';

import moment from 'moment'

    export async function saveItem(formData: FormData) {

      const results:any = await select({select: '*', from: 'Transactions'})
   
      const amount = formData.get('amount');
      var trans_date:any = formData.get('date');
      const client = formData.get('clients_hidden_input')
      const category = formData.get('categories_hidden_input')

      //process.stdout.write('\ndate is : ' + trans_date + '\n')
      process.stdout.write('\n I am here \n');
    

      process.stdout.write('\ndate is : ' + trans_date + '\n\n')


      process.stdout.write('amount : ' + amount + '\n')
      process.stdout.write('date : ' + trans_date + '\n')
      process.stdout.write('client : ' + client + '\n')
      process.stdout.write('category : ' + category + '\n')

       const insquery = {
            table: 'Transactions',
            fields: ['trans_id', 'account_id', 'date', 'amount', 'client_id', 'category_id'],
            vals: ['arandomstr', 1, convertToMySQLDate(trans_date), amount, 4, 3]
        }

        try {
           // const results = await insert(insquery);
        } catch (error) {
            process.stdout.write('Error inserting data: ' + error + '\n');
        }

      // Process the data (e.g., save to a database)
      // You can also return data or revalidate paths
    }