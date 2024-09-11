import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function RegisterComponent() {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-6 py-8 md:px-8">
        <div className="flex flex-col items-center gap-2">
          <CuboidIcon className="h-12 w-12 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Cubing Kerala</h2>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-semibold text-xl">Register</CardTitle>
            <CardDescription>Fill the details below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="email">Wca id</Label>
              <Input id="text" type="text" placeholder="1234ABCD56" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {/* <Link href="#" className="text-sm font-medium text-primary hover:underline" prefetch={false}>
                  Forgot password?
                </Link> */}
              </div>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-green-400 hover:bg-green-500 rounded-none text-black">
              Create account
            </Button>
          </CardFooter>
        </Card>
        <Link href="/login"><p className="text-sm text-center hover:underline hover:underline-offset-2 cursor-pointer">Already have an account? Login</p></Link>
      </div>
    </div>
  )
}

function CuboidIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z" />
      <path d="M10 22v-8L2.25 9.15" />
      <path d="m10 14 11.77-6.87" />
    </svg>
  )
}