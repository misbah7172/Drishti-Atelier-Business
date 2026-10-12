import { HiStar } from 'react-icons/hi2';
import './ReviewCard.css';

export default function ReviewCard({ review }) {
  const { user_name, rating, comment, created_at } = review;

  const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Generate user initial
  const initial = user_name ? user_name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-avatar">{initial}</div>
        <div className="review-meta">
          <span className="review-author">{user_name}</span>
          <span className="review-date">{formattedDate}</span>
        </div>
        <div className="review-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <HiStar
              key={star}
              size={14}
              className={star <= rating ? 'star-filled' : 'star-empty'}
            />
          ))}
        </div>
      </div>
      {comment && <p className="review-comment">{comment}</p>}
    </div>
  );
}
