import { AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

type OrderItemProps = {
    orderId: string;
    restaurant: string;
    restaurantImage?: string;
    items: string;
    itemsList: { name: string; qty: number; price: number }[];
    date: string;
    price: string;
};

export function OrderItem({ orderId, restaurant, restaurantImage, items, itemsList, date, price }: OrderItemProps) {
  return (
    <AccordionItem value={orderId}
                   className="border-b border-[var(--hover)]/20 last:border-b-0">
      <div className="flex items-center gap-4 p-3">

        {restaurantImage && (
          <img
            src={restaurantImage}
            alt={restaurant}
            className="h-12 w-12 rounded-lg object-cover border"
          />
        )}

        <div className="flex-1 grid gap-0.5">
          <p className="font-semibold text-[var(--hover)]">{restaurant}</p>
          <p className="text-sm text-gray-800">{items}</p>
          <p className="text-xs text-gray-800">{date}</p>
        </div>

        <div className="text-right">
          <p className="font-bold text-lg text-gray-800">{price}</p>
        </div>

        <AccordionTrigger className="p-2 rounded-full hover:bg-gray-100 group">
          <ChevronDown
            className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 hover:cursor-pointer"/>
        </AccordionTrigger>
      </div>

      <AccordionContent className="pb-4 pt-0 pl-20 pr-4">
        <div className="border-t pt-3 space-y-2">
          <h4 className="font-semibold text-sm text-gray-700">Order details:</h4>
          {
            // Și de aici
            itemsList.map((item, index) =>
              (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{item.qty} x {item.name}</span>
                  <span
                    className="font-medium text-gray-800">{((item.price * item.qty)).toFixed(2)} RON</span>
                </div>
              ))
          }
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
