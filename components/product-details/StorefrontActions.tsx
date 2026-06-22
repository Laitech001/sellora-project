import { ShoppingBag, MessageCircle } from "lucide-react";

type Props = {
  onAddToCart?: () => void;
  onContactSeller?: () => void;
  disabled?: boolean;
};

export default function StorefrontActions({
  onAddToCart,
  onContactSeller,
  disabled = false,
}: Props) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row">
      <button
        type="button"
        onClick={onAddToCart}
        disabled={disabled}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white bg-linear-to-r from-primary-600 to-accent-600 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
      >
        <ShoppingBag size={16} />
        {disabled ? 'Adding to cart...' : 'Add to cart'}
      </button>

      <button
        type="button"
        onClick={onContactSeller}
        className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium bg-gray-200 text-gray-800 border border-border-soft hover:bg-gray-200/50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
      >
        <MessageCircle size={16} />
        Contact Seller
      </button>
    </div>
  );
}