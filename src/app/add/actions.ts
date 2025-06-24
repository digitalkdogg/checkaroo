 'use server';

import {select} from '@/common/dbutils'

    export async function saveItem(formData: FormData) {

      const results:any = await select({select: '*', from: 'transactions'})
   
      const amount = formData.get('amount');
      const date = formData.get('date');
      const client = formData.get('clients_hidden_input')
      const category = formData.get('categories_hidden_input')

      process.stdout.write('amount : ' + amount + '\n')
      process.stdout.write('date : ' + date + '\n')
      process.stdout.write('client : ' + client + '\n')
      process.stdout.write('category : ' + category + '\n')


      // Process the data (e.g., save to a database)
      // You can also return data or revalidate paths
    }