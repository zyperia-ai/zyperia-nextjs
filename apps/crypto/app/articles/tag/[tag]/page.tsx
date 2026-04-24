import { redirect } from 'next/navigation'

export default async function TagRedirect(props: {
  params: Promise<{ tag: string }>
}) {
  const params = await props.params
  redirect(`/articles?tag=${encodeURIComponent(params.tag)}`)
}
