import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RatingStars from "@/components/ui/RatingStars";

interface OwnerDashboardData {
  store: {
    id: string;
    name: string;
    address: string;
    averageRating: number;
  };
  ratings: {
    name: string;
    email: string;
    rating: number;
  }[];
}

const OwnerDashboard = () => {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/owner/dashboard");
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch owner dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data)
    return (
      <div>
        Could not load dashboard data. You may not be registered as a store
        owner.
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{data.store.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data.store.address}</p>
          <div className="flex items-center mt-2">
            <p className="font-semibold mr-2">Average Rating:</p>
            <RatingStars rating={data.store.averageRating} readOnly />
            <span className="ml-2 font-bold">
              {Number(data.store.averageRating).toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">User Ratings</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>User Email</TableHead>
            <TableHead>Rating</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.ratings.map((rating, index) => (
            <TableRow key={index}>
              <TableCell>{rating.name}</TableCell>
              <TableCell>{rating.email}</TableCell>
              <TableCell>
                <RatingStars rating={rating.rating} readOnly />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OwnerDashboard;
