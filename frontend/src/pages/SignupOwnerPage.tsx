import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signupOwnerSchema, type SignupOwnerFormData } from "@/utils/schemas";
import api from "@/services/api";

const SignupOwnerPage = () => {
  const navigate = useNavigate();
  const form = useForm<SignupOwnerFormData>({
    resolver: zodResolver(signupOwnerSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
      storeName: "",
      storeAddress: "",
    },
  });

  const onSubmit = async (data: SignupOwnerFormData) => {
    try {
      await api.post("/auth/signup-owner", data);
      // Optionally show a success message/toast
      navigate("/login");
    } catch (error) {
      console.error("Owner signup failed:", error);
      form.setError("root", {
        message: "Registration failed. The email might already be in use.",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">
        Register Your Store
      </h1>
      <p className="text-center text-muted-foreground mb-6">
        Create an account for you and your business.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Your Details</h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Your St, Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h2 className="text-lg font-semibold border-b pb-2 pt-4">
            Store Details
          </h2>
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Name</FormLabel>
                <FormControl>
                  <Input placeholder="The Corner Cafe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storeAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Address</FormLabel>
                <FormControl>
                  <Input placeholder="456 Business Ave, Anytown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Just a regular user?{" "}
        <Link
          to="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up here
        </Link>
      </p>
    </div>
  );
};

export default SignupOwnerPage;
