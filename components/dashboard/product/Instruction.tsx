import { Card } from "@/ui";

export default function Instruction() {
  return (
    <>
      <Card className="m-2">
        <h1 className="title">Instruction</h1>

        <ul className="list-none text-sm text-gray-600">
          <li className="list-item">Enter the product name clearly</li>
          <li className="list-item">Add a detailed description</li>
          <li className="list-item">Upload a clear image</li>
          <li className="list-item">Set the correct price</li>
        </ul>
      </Card>
    </>
  )
}