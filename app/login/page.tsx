import FormLogin from "@/components/form-login";
import ToggleTheme from "@/components/toggle-theme";
import { Card } from "flowbite-react";

export default function Login() {
  return (
    <main className="min-h-screen grid place-items-center relative">
      <div className="absolute top-4 right-6">
        <ToggleTheme />
      </div>
      <Card>
        <FormLogin />
      </Card>
    </main>
  );
}
