import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminItems = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'regular' | 'special'>('regular');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('food_items').select('*').order('name');
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('regular');
    setIsAvailable(true);
    setImageUrl('');
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setCategory(item.category);
    setIsAvailable(item.is_available);
    setImageUrl(item.image_url || '');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from('food_items').delete().eq('id', id);
      fetchItems();
    }
  };

  const handleToggleAvailable = async (id: string, currentStatus: boolean) => {
    await supabase.from('food_items').update({ is_available: !currentStatus }).eq('id', id);
    fetchItems();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      price: parseFloat(price),
      category,
      is_available: isAvailable,
      image_url: imageUrl
    };

    if (isEditing && currentId) {
      await supabase.from('food_items').update(payload).eq('id', currentId);
    } else {
      await supabase.from('food_items').insert(payload);
    }
    
    resetForm();
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-heading text-text-h">Manage Menu Items</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2 text-sm px-4 shadow-sm">
            <Plus size={16} /> Add New Item
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="glass-card p-6 bg-white dark:bg-gray-800 border border-[var(--border-color)] mb-8">
          <h2 className="text-xl font-bold mb-6">{currentId ? 'Edit Item' : 'Add New Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input required value={name} onChange={e=>setName(e.target.value)} type="text" className="input-field bg-gray-50 dark:bg-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <input required value={price} onChange={e=>setPrice(e.target.value)} type="number" step="0.01" className="input-field bg-gray-50 dark:bg-gray-900" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea required value={description} onChange={e=>setDescription(e.target.value)} className="input-field bg-gray-50 dark:bg-gray-900" rows={3}></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={category} onChange={e=>setCategory(e.target.value as any)} className="input-field bg-gray-50 dark:bg-gray-900">
                  <option value="regular">Regular</option>
                  <option value="special">Special</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image URL (or leave blank)</label>
                <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} type="text" className="input-field bg-gray-50 dark:bg-gray-900" />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isAvailable} onChange={e=>setIsAvailable(e.target.checked)} className="w-5 h-5 rounded text-primary-600 focus:ring-primary-500" />
                  <span className="font-medium">Is Available</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary px-8">Save Item</button>
              <button type="button" onClick={resetForm} className="btn-secondary px-8">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-[var(--border-color)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-[var(--border-color)]">
                  <th className="p-4 font-bold text-text-muted">Item</th>
                  <th className="p-4 font-bold text-text-muted">Category</th>
                  <th className="p-4 font-bold text-text-muted">Price</th>
                  <th className="p-4 font-bold text-text-muted text-center">Status</th>
                  <th className="p-4 font-bold text-text-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="p-8 text-center"><div className="animate-pulse w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent mx-auto animate-spin"></div></td></tr>
                ) : items.map(item => (
                  <tr key={item.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image_url || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-xs text-text-muted truncate max-w-[200px]">{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${item.category === 'special' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium">₹{item.price.toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleToggleAvailable(item.id, item.is_available)} title="Toggle Availability">
                        {item.is_available 
                          ? <CheckCircle className="text-green-500 mx-auto" size={20} />
                          : <XCircle className="text-red-500 mx-auto" size={20} />
                        }
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && (
                  <tr><td colSpan={5} className="p-8 text-center text-text-muted">No items found. Create one above!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItems;
