import { Card } from "@/ui";

export default function Instruction() {
  return (
    <>
      <Card className='p-2'>
        <h1 className="title text-center">Instruction</h1>

        <ul className="list-none text-sm text-gray-200">
          <li className="list-item">Enter the product name clearly</li>
          <li className="list-item">Add a detailed description</li>
          <li className="list-item">Upload a clear image</li>
          <li className="list-item">Set the correct price</li>
        </ul>
      </Card>
    </>
  )
}