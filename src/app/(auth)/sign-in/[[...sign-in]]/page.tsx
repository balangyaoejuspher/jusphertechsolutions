import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <SignIn
        appearance={{
          elements: {
            footerAction__signUp: "hidden",
            footerAction: "hidden",
            footer: "hidden",
            footerPages: "hidden",
            footerPagesLink__signUp: "hidden",
          },
        }}
      />
    </div>
  )
}