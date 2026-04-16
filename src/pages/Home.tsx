import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ItemCard from '../components/ItemCard';
import ReviewCard from '../components/ReviewCard';

const Home = () => {
  const navigate = useNavigate();
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Fetch 3 special items
        const { data: specialData } = await supabase
          .from('food_items')
          .select('*')
          .eq('category', 'special')
          .limit(3);
        
        // Fetch 3 latest published reviews
        const { data: reviewData } = await supabase
          .from('reviews')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(3);

        if (specialData) setFeaturedItems(specialData);
        if (reviewData) setReviews(reviewData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 p-32 opacity-20 transform translate-x-1/3 -translate-y-1/4 filter blur-3xl">
            <div className="w-96 h-96 bg-primary-500 rounded-full"></div>
          </div>
          <div className="absolute bottom-0 left-0 p-32 opacity-20 transform -translate-x-1/4 translate-y-1/4 filter blur-3xl">
            <div className="w-96 h-96 bg-accent rounded-full"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-8 shadow-sm">
            <Sparkles size={16} />
            <span>Discover culinary mastery</span>
          </div>
          
          <h1 className="text-6xl sm:text-7xl font-bold font-heading text-text-h tracking-tight mb-8 max-w-4xl leading-tight">
            Flavors that inspire <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent">every bite.</span>
          </h1>
          
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-12">
            Welcome to Tasty Kitchen. The digital restaurant experience where quality meets convenience. Order online with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={() => navigate('/menu')} className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-lg">
              <UtensilsCrossed size={20} />
              Browse Menu
            </button>
            <button onClick={() => navigate('/special')} className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-lg bg-surface">
              Today's Specials
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface dark:bg-surface-dark border-y border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-heading text-text-h flex items-center gap-2">
                Special Highlights <Sparkles className="text-yellow-500 fill-yellow-500" size={24} />
              </h2>
              <p className="text-text-muted mt-2">Curated chef specials, just for you.</p>
            </div>
            <Link to="/special" className="hidden sm:flex text-primary-600 font-medium hover:text-primary-900 transition-colors gap-1 items-center">
              View all specials <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-80 rounded-2xl"></div>
              ))}
            </div>
          ) : featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <UtensilsCrossed size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-text-muted">No specials available today. Check back later!</p>
            </div>
          )}
          
          <Link to="/special" className="sm:hidden mt-8 flex justify-center text-primary-600 font-medium hover:text-primary-900 transition-colors gap-1 items-center">
            View all specials <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-heading text-text-h mb-4">What Our Customers Say</h2>
            <p className="text-text-muted">Real reviews from our beloved guests.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 h-40 rounded-2xl"></div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 glass rounded-2xl">
              <p className="text-text-muted italic">Be the first to leave a review!</p>
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link to="/reviews" className="btn-secondary inline-block">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;
