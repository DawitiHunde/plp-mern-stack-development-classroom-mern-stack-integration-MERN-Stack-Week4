import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useApi from '../hooks/useApi';

function PostView() {
  const { id } = useParams();
  const { get } = useApi();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    get(`/posts/${id}`)
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load post');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p><strong>Category:</strong> {post.category?.name || 'None'}</p>
      <Link to={`/posts/edit/${post._id}`}>Edit Post</Link>
      <br />
      <Link to='/'>Back to Posts</Link>
    </div>
  );
}

export default PostView;
