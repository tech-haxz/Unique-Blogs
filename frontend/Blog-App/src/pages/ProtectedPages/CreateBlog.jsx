import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { postBlog } from '../../api/BlogApi';

export const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);

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
    setImage(e.target.files[0]);
  };

  const handleImageRemove = () => {
    setImage(null);
    window.location.reload();
  }

  const handleSubmit = async(e) => {
    // e.preventDefault();
    // Handle form submission logic here (API call)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) {
      formData.append('image', image);
    }

    const response = await postBlog(formData);
    alert("Blog posted successfully!");
    console.log("Blog created:", response);
    // Reset form fields
    setTitle('');
    setBody('');
    setImage(null);
  };

  return (
    <div className="min-h-screen w-full absolute left-0 top-0 bg-white from-blue-50 to-purple-100 py-26">
      <div className="max-w-6xl mx-auto  rounded-lg p-8">
        <h1 className="text-3xl font-extrabold mb-12 text-center">Create a New Blog Post</h1>

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
            {image? <a className='text-red-600 cursor-pointer' onClick={handleImageRemove}>Remove</a> : <></>}
            
            {image && (
              <div className="mt-4">
                <img
                  src={URL.createObjectURL(image)}
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
            Publish Blog
          </button>
        </form>
      </div>
    </div>
  );
};