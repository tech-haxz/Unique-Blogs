import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { editBlog, getBlog } from '../../api/BlogApi';
import { useParams, useNavigate } from 'react-router-dom';


export const EditBlog = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null); // file object or null
  const [imagePreview, setImagePreview] = useState(''); // preview URL

  const navigate = useNavigate();

  const blog_id = useParams().id;

  useEffect(() => {
    async function fetchBlogData() {
      try {
        const res = await getBlog(blog_id);
        setTitle(res.title);
        setBody(res.body);
        setImage(null); // no file selected yet
        setImagePreview(res.image ? `http://127.0.0.1:8000${res.image}` : '');
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    }
    fetchBlogData();
  }, [blog_id]);

  const modules = {
    toolbar: [
      [{ header: [1,2,3,4,5,6, false] }],
      [{font: ['serif', 'sans-serif', 'monospace']}],
      [{size: ['small', false, 'large', 'huge']}],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['code-block']
    ]
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) {
      formData.append('image', image);
    }

    const response = await editBlog(blog_id, formData);
    alert("Blog Edited successfully!");
    // Optionally, redirect or update UI
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full absolute left-0 top-0 bg-white from-blue-50 to-purple-100 py-26">
      <div className="max-w-6xl mx-auto  rounded-lg p-8">
        <h1 className="text-3xl font-extrabold mb-12 text-center"> Edit Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-8" action={'/'}>
          <div className='flex justify-center items-center gap-10'>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="h-10 underline cursor-pointer px-5 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              style={{ color: image ? 'Blue' : 'red' }}
            />
            {imagePreview && (
              <a className='text-red-600 cursor-pointer' onClick={handleImageRemove}>Remove</a>
            )}
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-lg border border-purple-200"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter blog title"
              required
            />
          </div>
          <div className='text-4xl'>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Content</label>
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              className="rounded-lg h-[300px] mb-20"
              modules={modules}
              placeholder="Write your blog content here..."
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-[10rem] py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 cursor-pointer transition duration-200"
          >
           Save
          </button>
        </form>
      </div>
    </div>
  );
};