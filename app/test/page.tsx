import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'

async function TestData() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('profile').select('*')
  return <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
}

export default function TestPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <TestData />
    </Suspense>
  )
}
