import { createContext, useEffect, useState} from "react";
import { getCurrentUser, getUserDetails } from "../api/BlogApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  async function getCurrUser() {
    try {
      const response = await getCurrentUser();
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  async function getUserDetail() {
    const currUser = await getCurrUser();
    if (!currUser) return null;

    const userDetails = await getUserDetails(currUser.username);
    return userDetails;

  }


  return (
    <AuthContext.Provider value={{ getCurrUser, getUserDetail}}>
      {children}
    </AuthContext.Provider>
  );
};
