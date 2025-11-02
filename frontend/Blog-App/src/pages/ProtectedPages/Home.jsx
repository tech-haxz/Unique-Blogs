import { useEffect, useState, useContext } from "react";
import BlogCard from "../../components/BlogCard";
import { getBlogs } from "../../api/BlogApi";
import Loading from "../../components/Loading.jsx";

export const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  if (blogs.length === 0) {
    return <div className="main w-full bg-white absolute left-0 top-0">No Blogs Found</div>;
  }

  if (!blogs) {
    return <Loading />;
  }

  return (
    <div className="main w-full bg-white absolute left-0 top-0">
      <div className="home w-[70%] mx-auto my-10 bg-white p-15">
        <h1 className="text-xl">All Posts</h1>
        <hr />

        {blogs.map((blog) => {
          return <BlogCard key={blog.id} data={blog} />;
        })}
      </div>
    </div>
  );
};
