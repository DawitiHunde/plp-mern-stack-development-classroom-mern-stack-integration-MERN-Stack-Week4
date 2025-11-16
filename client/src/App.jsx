import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import PostView from './components/PostView';
import PostForm from './components/PostForm';
import Navigation from './components/Navigation';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path='/' element={<PostList />} />
        <Route path='/posts/:id' element={<PostView />} />
        <Route path='/posts/edit/:id' element={<PostForm />} />
        <Route path='/posts/new' element={<PostForm />} />
      </Routes>
    </Router>
  );
}

export default App;
