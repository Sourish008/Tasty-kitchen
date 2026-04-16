import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ReviewCard from '../components/ReviewCard';
import { MessageSquareQuote } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-4 bg-primary-50 text-primary-600 rounded-full mb-6">
          <MessageSquareQuote size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-h mb-6">Hear From Our Guests</h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          We take pride in our service. Read what our wonderful customers have to say about their experience at Tasty Kitchen.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-surface dark:bg-gray-800 h-48 rounded-2xl border border-[var(--border-color)]"></div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map(review => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass rounded-3xl max-w-3xl mx-auto border border-dashed border-[var(--border-color)]">
          <p className="text-2xl text-text-muted italic">"Be the first to leave a review after your order!"</p>
        </div>
      )}
      
    </div>
  );
};

export default Reviews;
