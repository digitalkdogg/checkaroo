// app/actions.ts
'use server';

import {writelog} from '@/common/logs';
import { write } from 'fs';

export async function createItem(data:any) {
  try {

    return { title: 'Success!' + data.name }; // Return a success message object
    //return { title: 'Success!' + item}; // Return a success message object
  } catch (e) {
    writelog('Error creating item: ' + e);
    return { title: 'There was an error.' }; // Return an error message object
  }
}