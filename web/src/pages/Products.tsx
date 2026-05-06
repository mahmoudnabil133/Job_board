import { useState } from "react"
import type { Status } from "@/components/productCard"
import ProductCard from "@/components/productCard"
type Product = {
  image:string,
  name:string,
  price:number,
  desc:string,
  category:string,
  status: Status
}
const Product = () => {

 const [products] = useState<Product[]>([
    {
      image: "https://picsum.photos/200?random=1",
      name: "iPhone 14",
      price: 900,
      desc: "Latest Apple smartphone with A15 chip",
      category: "electronics",
      status: "in_stock",
    },
    {
      image: "https://picsum.photos/200?random=2",
      name: "Samsung TV 55\"",
      price: 700,
      desc: "4K Smart TV with HDR support",
      category: "electronics",
      status: "LOW_STOCK",
    },
    {
      image: "https://picsum.photos/200?random=3",
      name: "Nike Air Max",
      price: 120,
      desc: "Comfortable running shoes",
      category: "fashion",
      status: "in_stock",
    },
    {
      image: "https://picsum.photos/200?random=4",
      name: "Leather Jacket",
      price: 250,
      desc: "Stylish black leather jacket",
      category: "fashion",
      status: "out_of_stock",
    },
    {
      image: "https://picsum.photos/200?random=5",
      name: "Gaming Laptop",
      price: 1500,
      desc: "High performance laptop for gaming",
      category: "electronics",
      status: "in_stock",
    },
    {
      image: "https://picsum.photos/200?random=6",
      name: "Office Chair",
      price: 180,
      desc: "Ergonomic chair for long working hours",
      category: "furniture",
      status: "LOW_STOCK",
    },
    {
      image: "https://picsum.photos/200?random=7",
      name: "Wooden Desk",
      price: 300,
      desc: "Minimalist wooden office desk",
      category: "furniture",
      status: "in_stock",
    },
    {
      image: "https://picsum.photos/200?random=8",
      name: "Bluetooth Headphones",
      price: 80,
      desc: "Noise cancelling wireless headphones",
      category: "electronics",
      status: "out_of_stock",
    },
  ]);    
  
  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
        {products.map((p=>(
          <ProductCard key={p.name} img={p.image} name={p.name} price={p.price} desc={p.desc} status={p.status} category={p.category}/>
        )))}
      </div>
    </div>
  )
}

export default Product;
