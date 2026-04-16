import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image_url?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(i => i.id === newItem.id);
          const qtyToAdd = newItem.qty || 1;
          
          if (existingItem) {
            return {
              items: state.items.map(i => 
                i.id === newItem.id ? { ...i, qty: i.qty + qtyToAdd } : i
              )
            };
          }
          return { items: [...state.items, { ...newItem, qty: qtyToAdd }] };
        });
      },

      updateQuantity: (id, qty) => {
        if (qty < 1) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, qty } : i)
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0);
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      }
    }),
    {
      name: 'tasty-kitchen-cart', // local storage key
    }
  )
);
