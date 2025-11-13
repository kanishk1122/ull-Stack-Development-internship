import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addStoreSchema, type AddStoreFormData } from "@/utils/schemas";
import api from "@/services/api";
import { useState, useEffect } from "react";

interface AddStoreDialogProps {
  onStoreAdded: (store: any) => void;
}

type StoreOwner = { id: string; name: string; email: string };

export function AddStoreDialog({ onStoreAdded }: AddStoreDialogProps) {
  const [open, setOpen] = useState(false);
  const [owners, setOwners] = useState<StoreOwner[]>([]);
  const form = useForm<AddStoreFormData>({
    resolver: zodResolver(addStoreSchema),
    defaultValues: { name: "", address: "", ownerId: "" },
  });

  useEffect(() => {
    if (open) {
      api
        .get("/admin/users?role=STORE_OWNER")
        .then((res) => setOwners(res.data));
    }
  }, [open]);

  const onSubmit = async (data: AddStoreFormData) => {
    try {
      const response = await api.post("/admin/stores", data);
      onStoreAdded(response.data);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add store:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Store</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Owner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an owner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create Store
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
