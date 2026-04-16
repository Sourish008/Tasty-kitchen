import { Star, StarHalf } from 'lucide-react';

type Review = {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

interface ReviewCardProps {
  review: Review;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const date = new Date(review.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Generate stars based on rating (1-5)
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(review.rating);
    const hasHalfStar = review.rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-yellow-400 text-yellow-400" size={16} />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-yellow-400 text-yellow-400" size={16} />);
    }

    const emptyStars = 5 - Math.ceil(review.rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-gray-300 dark:text-gray-600" size={16} />);
    }

    return stars;
  };

  return (
    <div className="glass p-6 rounded-2xl flex flex-col h-full bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-text-main font-heading">{review.reviewer_name}</h4>
          <span className="text-xs text-text-muted">{date}</span>
        </div>
        <div className="flex gap-1">
          {renderStars()}
        </div>
      </div>
      <p className="text-sm text-text-muted italic flex-grow">
        "{review.comment}"
      </p>
    </div>
  );
};

export default ReviewCard;
