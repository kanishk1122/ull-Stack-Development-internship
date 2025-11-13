import React, { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RatingStars from "@/components/ui/RatingStars";
import { AddStoreDialog } from "@/components/admin/AddStoreDialog";

type Store = {
  id: string;
  name: string;
  address: string;
  ownerEmail: string;
  overallRating: number;
};

const ManageStoresPage = () => {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    api.get("/admin/stores").then((res) => setStores(res.data));
  }, []);

  const handleStoreAdded = (newStore: Store) => {
    // A full refetch might be easier to get owner email etc.
    api.get("/admin/stores").then((res) => setStores(res.data));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Stores</h1>
        <AddStoreDialog onStoreAdded={handleStoreAdded} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Owner Email</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell>{store.name}</TableCell>
              <TableCell>{store.address}</TableCell>
              <TableCell>{store.ownerEmail}</TableCell>
              <TableCell>
                <RatingStars rating={store.overallRating} readOnly />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageStoresPage;
