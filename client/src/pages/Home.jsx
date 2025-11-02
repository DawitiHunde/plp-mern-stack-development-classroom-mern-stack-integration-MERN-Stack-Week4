import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [page, selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts(page, 10, selectedCategory || null);
      setPosts(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const response = await postService.searchPosts(searchQuery);
      setPosts(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && posts.length === 0) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>Blog Posts</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      <div className="filters">
        <button
          className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => {
            setSelectedCategory('');
            setPage(1);
          }}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`filter-btn ${selectedCategory === category._id ? 'active' : ''}`}
            onClick={() => {
              setSelectedCategory(category._id);
              setPage(1);
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            {post.featuredImage && (
              <div className="post-image">
                <img
                  src={`http://localhost:5000/uploads/${post.featuredImage}`}
                  alt={post.title}
                />
              </div>
            )}
            <div className="post-content">
              <Link to={`/posts/${post._id}`}>
                <h2 className="post-title">{post.title}</h2>
              </Link>
              {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
              <div className="post-meta">
                <span className="post-author">By {post.author?.name || 'Unknown'}</span>
                <span className="post-category">{post.category?.name}</span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Link to={`/posts/${post._id}`} className="read-more">
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="no-posts">No posts found.</div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

