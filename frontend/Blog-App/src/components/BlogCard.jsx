import parse from 'html-react-parser';
import { NavLink } from 'react-router-dom';

function BlogCard(props) {
  const { id, title, body, image, creator } = props.data;
  
  const truncatedDesc = body.length > 200 ? body.slice(0, 200) + "..." : body;

  return (
    <div className="mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-6xl my-10">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:h-full md:w-100"
            src={`http://127.0.0.1:8000${image}`}
            alt="Blog Thumbnail"
          />
        </div>
        <div className="p-8 flex-1 flex flex-col justify-between">
          <div>
            <div className="uppercase tracking-wide text-indigo-500 font-semibold text-2xl">
              <NavLink to={`/blog/${id}`}>{title}</NavLink>
            </div>
            <div className="mt-2 text-gray-500">{parse(truncatedDesc)}</div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {creator?.name ? creator.name[0] : "A"}
            </div>
            <span className="text-gray-700 font-medium">{creator?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
