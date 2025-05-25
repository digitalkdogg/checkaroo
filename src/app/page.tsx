import Dashboard from '@/app/components/Dashboard'
import Leftside from '@/app/components/Leftside'
import tail from '@tailwindcss/postcss'

import { getStaticProps } from 'next/dist/build/templates/pages'
//import { getPost } from '@/lib/data'
 
export default async function Page({ params }: { params: { id: string } }) {
  
  return (
    <div>
      <main>
        <Leftside />
        <Dashboard />
      </main>
    </div>
  )
}
