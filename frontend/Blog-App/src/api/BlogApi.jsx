import axios from "axios";

// Create an axios instance with base URL and headers
export const api = axios.create({
    baseURL: "https://unique-blogs.onrender.com/api/v1",
    withCredentials: true, //It is important to include this option to allow cookies to be sent with requests.
    headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
    },
});

// Add a response interceptor for token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Prevent infinite loop: don't retry for refresh endpoint
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/users/refresh')
    ) {
      originalRequest._retry = true;
      try {
        await api.post('/users/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Optionally handle logout or redirect
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Function to get all blogs
export const getBlogs = async() => {
  try {
    const response = await api.get('/blogs');
    return response.data;

  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
    }  

};

//Function to Post a new blog
export const postBlog = async(blogData) => {
    try {
        const response = await api.post('/blog', blogData, {headers: {
            "Content-Type": 'multipart/form-data',
        }});
        return response.data;
        
    }catch (error) {
        console.error("Error posting blog:", error);
    }
}

//Function to Edit a blog.
export const editBlog = async(blog_id, blogData) => {
    try {
        const response = await api.put(`/blog/${blog_id}`, blogData, {headers: {
            "Content-Type": 'multipart/form-data',
        }});
        return response.data;
    } catch (error) {
        console.error("Error editing blog:", error);
        throw error;
    }
}

export const deleteBlog = async(blog_id) => {
    try {
        const response = await api.delete(`/blog/${blog_id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting blog:", error);
        throw error;
    }
}

// Function to register a new user
export const registerUser = async(userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    }
    catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

// Function to login a user
export const loginUser = async(credentials) => {
    try {
        const response =  await api.post('/users/login', credentials, {headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            Accept: 'application/json',
        }});
        return response.data;
    }
    catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};
// Function to logout a user
export const logoutUser = async() => {
    try {
        const response = await api.post('/users/logout');
        return response.data;
    }
    catch (error) {
        console.error("Error logging out user:", error);
        throw error;
    } 

};

export const getUserDetails = async(username) => {
    try {
        const response = await api.get(`/user/${username}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
}

export const getBlog = async(blog_id) => {
    try {
        const response = await api.get(`/blog/${blog_id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching blog details:", error);
        throw error;
        
    }
}


export const getCurrentUser = async() => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.error("Error fetching current user:", error);
        throw error;
    }
}