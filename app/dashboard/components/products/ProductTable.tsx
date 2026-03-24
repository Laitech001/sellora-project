import Table from "../Table";
import ProductRow from "./ProductRow";
import { getProducts } from "@/lib/data/Products";

export default async function ProductTable() {
  const products = await  getProducts();

  return (
    <Table>
      <thead>
        <tr className="text-left text-sm font-semibold text-gray-600 border-b border-gray-300 py-4">
          <th className="py-3">Image</th>
          <th>Name</th>
          <th>Price</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products && products.map((product) => (
          <ProductRow
            key={product.id}
            imagePath={product.image} 
            title={product.name}
            price= {product.price}
            status={product.status}
            editLink={"product/link"}
            editText={"Edit"}
            deleteLink={"product/delete"}
            deleteText={"Delete"}
          />
        ))}
      </tbody>
    </Table>
  )
}