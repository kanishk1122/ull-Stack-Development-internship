import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RatingStars from "../ui/RatingStars";

export interface Store {
  id: string;
  name: string;
  address: string;
  overallRating: number | string; // Allow string from API
}

interface StoreCardProps {
  store: Store;
}

const StoreCard = ({ store }: StoreCardProps) => {
  // Convert the rating from a string to a number for calculations and display.
  const rating = Number(store.overallRating) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{store.address}</p>
        <div className="flex items-center">
          <RatingStars rating={rating} readOnly />
          <span className="ml-2 text-sm text-muted-foreground">
            ({rating.toFixed(1)})
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/store/${store.id}`}>View Store Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
