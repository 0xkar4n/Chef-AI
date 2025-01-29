import { LoginForm } from '@/components/LoginForm'
import { Blobs } from '@/components/Blobs'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 px-4 py-12 sm:px-6 lg:px-8">
      <Blobs />
      <LoginForm />
    </div>
  )
}

