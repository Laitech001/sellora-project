import { Card } from "@/ui";
import {
  Images,
  FileText,
  BadgeDollarSign,
  PackageCheck,
} from "lucide-react";

const instructions = [
  {
    image: Images,
    title: 'Add quality product images',
    subtext: 'Clear photos help customers make confident buying decisions.'
  }, {
    image: FileText,
    title: 'Provide complete information',
    subtext: 'Describe features, benefits, and specifications accurately.',
  }, {
    image: BadgeDollarSign,
    title: 'Use the correct pricing',
    subtext: "Ensure your price matches the product and market expectations."
  }, {
    image: PackageCheck,
    title: 'Maintain accurate stock levels',
    subtext: 'Updated inventory helps prevent order issues and disappointment.'
  }
]

export default function Instruction() {
  return (
    <>
      <Card className='p-2 max-w-sm max-h-150 mx-auto'>
        <h1 className="title text-center">Create a Product Customers Can Trust</h1>

        {
          instructions.map((instruction) => (
            <ul>
              <li className="mb-2">
                <div className="flex items-center gap-2">
                  <instruction.image size={20} className="text-primary-400"/>

                  <h1 className="text-white text-lg">{instruction.title}</h1>
                </div>
                <p className="text-text-secondary text-base">{instruction.subtext}</p>
              </li>
            </ul>
          ))
        }

      </Card>
    </>
  )
}