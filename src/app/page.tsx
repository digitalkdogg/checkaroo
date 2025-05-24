import Account from '@/app/components/Account'
import Trans from '@/app/components/Trans'

import { getStaticProps } from 'next/dist/build/templates/pages'
//import { getPost } from '@/lib/data'
 
export default async function Page({ params }: { params: { id: string } }) {
  
  return (
    <div>
      <main>
        <Account />
        <Trans />
      </main>
    </div>
  )
}
