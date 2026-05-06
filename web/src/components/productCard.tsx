import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";

export type Status = 'in_stock' | 'LOW_STOCK' | 'out_of_stock';
const ProductCard = ({
  img,
  name,
  price,
  desc,
  category,
  status,
}: {
  img: any;
  name: any;
  price: any;
  desc: any;
  category: any;
  status: Status;
}) => {
  return (
    <Card className="w-56 flex flex-col shadow-md hover:shadow-lg transition-shadow">
      <div className="w-full h-40 overflow-hidden bg-gray-200 rounded-t-lg">
        <img src={img} className="w-full h-full object-cover" />
      </div>
      <CardHeader className="flex-1">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-xs capitalize">{category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{desc}</p>
        <p className="text-xl font-bold mt-2">${price}</p>
      </CardContent>
      <CardFooter>
        <Badge className={status === "in_stock" ? "bg-green-600" : status === "LOW_STOCK" ? "bg-yellow-600" : "bg-red-600"}>
          {status === "in_stock" ? "In Stock" : status === "LOW_STOCK" ? "Low Stock" : "Out of Stock"}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
