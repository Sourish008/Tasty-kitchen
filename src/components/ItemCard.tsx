import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../stores/useCartStore';

// Temporary type since we don't have types generated yet
type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
};

interface ItemCardProps {
  item: FoodItem;
}

const ItemCard = ({ item }: ItemCardProps) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if clicked via Link wrapper
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url
    });
  };

  return (
    <div className="glass-card overflow-hidden flex flex-col h-full bg-white dark:bg-gray-800">
      <Link to={`/item/${item.id}`} className="block relative h-48 overflow-hidden group">
        <img
          src={item.image_url || 'https://via.placeholder.com/400x300?text=Food+Image'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!item.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold px-4 py-2 bg-red-500/80 rounded border border-red-400">
              Out of Stock
            </span>
          </div>
        )}
        {item.category === 'special' && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Special
          </div>
        )}
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/item/${item.id}`} className="hover:text-primary-600 transition-colors">
          <h3 className="font-heading font-bold text-xl mb-2">{item.name}</h3>
        </Link>
        <p className="text-text-muted text-sm line-clamp-2 mb-4 flex-grow">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="font-bold text-lg text-primary-600">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!item.is_available}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${item.is_available
                ? 'bg-primary-50 text-primary-600 hover:bg-primary-600 hover:text-white active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
              }`}
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
