import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, MessageSquare, Check, X } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reviews')
      .select('*, user:users(display_name)')
      .order('created_at', { ascending: false });
      
    if (!error && data) setReviews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from('reviews').update({ is_published: !current }).eq('id', id);
    fetchReviews();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review permanently?')) {
      await supabase.from('reviews').delete().eq('id', id);
      fetchReviews();
    }
  };

  const handleAddManualReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('reviews').insert({
      reviewer_name: name,
      rating: parseInt(rating),
      comment: comment,
      is_published: true // auto publish manual reviews
    });
    
    setShowAdd(false);
    setName('');
    setRating('5');
    setComment('');
    fetchReviews();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-text-h">Manage Reviews</h1>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`${showAdd ? 'btn-secondary text-red-500 border-red-500' : 'btn-primary'} px-4 py-2 flex items-center gap-2 shadow-sm text-sm shrink-0`}
        >
          {showAdd ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {showAdd && (
        <div className="glass-card p-6 bg-white dark:bg-gray-800 border border-[var(--border-color)] mb-8">
          <h2 className="text-xl font-bold mb-4">Add Manual Review</h2>
          <form onSubmit={handleAddManualReview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reviewer Name</label>
                <input required value={name} onChange={e=>setName(e.target.value)} type="text" className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <select value={rating} onChange={e=>setRating(e.target.value)} className="input-field">
                  {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <textarea required value={comment} onChange={e=>setComment(e.target.value)} rows={3} className="input-field" placeholder="Write their review here..."></textarea>
            </div>
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           [1, 2, 3].map(i => <div key={i} className="animate-pulse bg-surface dark:bg-gray-800 h-48 rounded-2xl"></div>)
        ) : reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="glass-card p-6 bg-white dark:bg-gray-800 border border-[var(--border-color)] flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-text-h flex items-center gap-2">
                    {review.reviewer_name}
                    {review.user && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Verified User</span>}
                  </h4>
                  <div className="text-yellow-400 font-bold text-sm tracking-widest">{Array(review.rating).fill('★').join('')}</div>
                </div>
              </div>
              
              <p className="text-sm text-text-muted italic flex-grow mb-6">"{review.comment}"</p>
              
              <div className="flex justify-between items-center border-t border-[var(--border-color)] pt-4 mt-auto">
                <button 
                  onClick={() => togglePublish(review.id, review.is_published)}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full uppercase transition-colors ${
                    review.is_published ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-red-100 hover:text-red-700' : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-green-100 hover:text-green-700'
                  }`}
                  title={review.is_published ? "Click to unpublish" : "Click to publish"}
                >
                  {review.is_published ? <><Check size={12}/> Published</> : <><X size={12}/> Hidden</>}
                </button>
                
                <button onClick={() => handleDelete(review.id)} className="text-red-400 hover:text-red-600 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 glass rounded-2xl glass border border-[var(--border-color)]">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-text-muted">No reviews have been submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
