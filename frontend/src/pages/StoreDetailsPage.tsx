import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RatingStars from "../components/ui/RatingStars";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

// Mock data structure
interface StoreDetails {
  id: string;
  name: string;
  address: string;
  overallRating: number;
  ratingDistribution: { [key: number]: number };
  userRating?: number;
}

const StoreDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const [store, setStore] = useState<StoreDetails | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/stores/${id}`);
        setStore(response.data);
        setUserRating(response.data.userRating || 0);
      } catch (error) {
        console.error("Failed to fetch store details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id, user]);

  const handleRatingSubmit = async () => {
    if (!userRating || !id) return;
    try {
      await api.post("/ratings", { storeId: id, rating: userRating });
      alert(`Rating of ${userRating} submitted!`);
      // Optionally refetch store data to update overall rating
      const response = await api.get(`/stores/${id}`);
      setStore(response.data);
    } catch (error) {
      console.error("Failed to submit rating:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!store) return <div>Store not found.</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold">{store.name}</h1>
      <p className="text-lg text-muted-foreground mt-2">{store.address}</p>

      <div className="flex items-center my-4">
        <RatingStars rating={store.overallRating} readOnly />
        <span className="ml-2 text-xl font-bold">
          {store.overallRating.toFixed(1)}
        </span>
      </div>

      {/* Rating Distribution could be a separate component */}
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Rating Distribution</h2>
        {/* Render distribution bars */}
      </div>

      {isAuthenticated && (
        <div className="my-8 p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">
            {store.userRating ? "Your Rating" : "Submit Your Rating"}
          </h3>
          <RatingStars rating={userRating} onRatingChange={setUserRating} />
          <Button onClick={handleRatingSubmit} className="mt-4">
            {store.userRating ? "Update Rating" : "Submit Rating"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoreDetailsPage;
