import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/ContextAPI";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import parse from "html-react-parser";
import { useNavigate } from "react-router-dom";
import { deleteBlog } from "../api/BlogApi";

const Profile = () => {
  const data = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const user = await data.getUserDetail();
      setUser(user);
      setBlogs(user.blogs || []);
    };
    getData();
  }, [data]);

  const handleBlogView = (id) => {
    const blog = blogs.find((b) => b.id === id);
    if (blog) {
      navigate(`/blog/${id}`);
    }
  };

  const handleEdit = (id) => {
    // Implement edit logic or navigation here
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (confirmDelete) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter((b) => b.id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  // Helper to truncate blog body
  const truncate = (text, maxLength = 120) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="w-full absolute bg-gray-50 top-10 left-0">
      {/* Profile Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-6 px-6 py-10">
          <div className="flex-shrink-0">
            <div className="w-28 h-28 rounded-full bg-indigo-200 flex items-center justify-center text-5xl font-bold text-indigo-700 shadow">
              {user.name
                ? user.name[0]
                : user.username
                ? user.username[0]
                : "U"}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              {user.name}
            </h1>
            <div className="text-gray-500 text-lg">@{user.username}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
            <p className="mt-2 text-gray-700">
              Blogger. Dreamer. Coffee enthusiast.
            </p>
          </div>
          <div>
            <button onClick={() => alert("This feature is currently unavailable!")} className="bg-gray-900 text-white px-5 py-2 rounded-full font-semibold hover:bg-gray-700 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Blog Management Section */}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Blogs</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="group relative bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl shadow hover:shadow-lg transition p-0 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="h-36 w-full overflow-hidden rounded-t-xl bg-gray-200 flex items-center justify-center">
                  {blog.image ? (
                    <img
                      src={`http://127.0.0.1:8000${blog.image}`}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <button
                    onClick={() => handleBlogView(blog.id)}
                    className="text-xl text-left cursor-pointer font-semibold text-indigo-700 group-hover:text-indigo-900 transition hover:underline"
                  >
                    {blog.title}
                  </button>
                  <div className="text-gray-600 mt-2 flex-1 break-words line-clamp-3">
                    {typeof blog.body === "string"
                      ? parse(truncate(blog.body))
                      : ""}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-400">
                      {blog.date || ""}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(blog.id)}
                        className="text-lg flex cursor-pointer text-black gap-1 py-1 px-3 rounded-lg hover:bg-blue-500 hover:text-white transition"
                      >
                        <HiOutlinePencilSquare className="text-2xl" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="text-xs text-red-600 px-3 py-1 rounded-lg hover:bg-red-600 hover:text-white transition"
                      >
                        <MdDeleteForever className="text-3xl" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {blogs.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              You haven't posted any blogs yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
