 'use server';

import {select} from '@/common/dbutils'

    export async function createItem(formData: FormData) {

       const results:any = await select({select: '*', from: 'transactions'})
      process.stdout.write('I am create item');
      process.stdout.write(formData.getAll('amount').toString())
      const itemName = formData.get('amount');
      // Process the data (e.g., save to a database)
      console.log(`Item created: ${itemName}`);
      // You can also return data or revalidate paths
    }