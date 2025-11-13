import React from "react";

const UserDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Ratings</h1>
      <p>
        This is the user dashboard. A table of stores with your ratings will be
        displayed here.
      </p>
      {/* StoreTable component will go here */}
    </div>
  );
};

export default UserDashboard;
