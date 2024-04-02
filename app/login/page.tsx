import FormLogin from "@/components/form-login";
import { Card } from "flowbite-react";

export default function Login() {
  return (
    <main className="min-h-screen grid place-items-center">
      <Card>
        <FormLogin />
      </Card>
    </main>
  );
}
