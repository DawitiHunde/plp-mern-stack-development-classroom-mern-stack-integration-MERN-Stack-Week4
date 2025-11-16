import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { get, post, put } = useApi();
  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      get(`/posts/${id}`)
        .then(data => {
          setForm({ title: data.title, content: data.content, category: data.category?._id || '' });
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to load post');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (id) {
        await put(`/posts/${id}`, form);
      } else {
        await post('/posts', form);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>{id ? 'Edit Post' : 'Create New Post'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type='text' name='title' value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Content:</label>
          <textarea name='content' value={form.content} onChange={handleChange} required />
        </div>
        <div>
          <label>Category ID:</label>
          <input type='text' name='category' value={form.category} onChange={handleChange} required />
        </div>
        <button type='submit' disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  );
}

export default PostForm;
