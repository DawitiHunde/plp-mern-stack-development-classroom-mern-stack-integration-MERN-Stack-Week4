import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './PostView.css';

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await postService.getPost(id);
      setPost(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postService.deletePost(id);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      setSubmitting(true);
      await postService.addComment(id, { content: comment });
      setComment('');
      await loadPost(); // Reload to get updated comments
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (error && !post) {
    return (
      <div className="alert alert-error">
        {error}
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Go Home
        </Link>
      </div>
    );
  }

  if (!post) {
    return <div className="loading">Post not found</div>;
  }

  const canEdit = isAuthenticated && (user?._id === post.author?._id || user?.role === 'admin');

  return (
    <div className="post-view">
      <div className="post-header">
        <Link to="/" className="back-link">← Back to Posts</Link>
        {canEdit && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`} className="btn btn-primary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>

      <article className="post-article">
        {post.featuredImage && (
          <div className="post-featured-image">
            <img
              src={`http://localhost:5000/uploads/${post.featuredImage}`}
              alt={post.title}
            />
          </div>
        )}

        <div className="post-meta-header">
          <span className="post-category-badge">{post.category?.name}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="post-title">{post.title}</h1>

        <div className="post-author-info">
          <span>By {post.author?.name || 'Unknown'}</span>
          {post.viewCount > 0 && (
            <span className="post-views">{post.viewCount} views</span>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />

        <div className="comments-section">
          <h2>Comments ({post.comments?.length || 0})</h2>

          {isAuthenticated ? (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="form-control"
                rows="3"
              />
              <button
                type="submit"
                disabled={submitting || !comment.trim()}
                className="btn btn-primary"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to leave a comment
            </p>
          )}

          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <strong>{comment.user?.name || 'Anonymous'}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostView;

