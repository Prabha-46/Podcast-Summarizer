import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="font-headline text-9xl font-bold text-primary">404</h1>
      <h2 className="font-headline text-3xl mt-4 mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6">Oops! The page you are looking for does not exist.</p>
      <Button asChild>
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  )
}
