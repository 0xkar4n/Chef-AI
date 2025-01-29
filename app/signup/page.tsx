import { SignupForm } from '@/components/SignupForm'
import { Blobs } from '@/components/Blobs'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-12 sm:px-6 lg:px-8">
      <Blobs />
      <SignupForm />
    </div>
  )
}

