"use client";

import React from "react";

interface HeaderProps {
  user: string | null;
  onAddRecipe: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onAddRecipe }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-yellow-100 shadow-md">
      <h1 className="text-2xl font-bold">My Recipes</h1>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="font-medium">Hello, {user}</span>
            <button
              onClick={onAddRecipe}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Recipe
            </button>
          </>
        ) : (
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;