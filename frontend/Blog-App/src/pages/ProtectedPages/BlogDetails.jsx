import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlog } from "../../api/BlogApi";
import parse from 'html-react-parser';

export const BlogDetails = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    async function fetchBlogDetails() {
        
        try {
            const res = await getBlog(id);
            setData(res);
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        fetchBlogDetails();
    }, [id]);

    return (
        <div className="w-full absolute top-0 left-0 bg-white py-12 px-2">
            <div className="max-w-7xl  p-10 mx-auto shadow-m bg-white overflow-hidden border-gray-200">
                {data ? (
                    <>
                        <div className="relative">
                            <img
                                src={`http://127.0.0.1:8000${data.image}`}
                                alt={data.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-40 w-full px-6 py-2">
                                <h1 className="text-3xl font-extrabold text-white drop-shadow">{data.title}</h1>
                            </div>
                        </div>
                        <div className="p-8">
                            {data.creator && (
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                        {data.creator.name ? data.creator.name[0] : data.creator.username[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-700">{data.creator.name || data.creator.username}</div>
                                        <div className="text-xs text-gray-400">{data.creator.email}</div>
                                    </div>
                                </div>
                            )}
                            <div className="prose max-w-none text-gray-800 text-xl">
                                {parse(data.body)}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <span className="text-gray-500 text-lg">Loading blog details...</span>
                    </div>
                )}
            </div>
        </div>
    );
};