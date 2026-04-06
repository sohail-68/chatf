import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [img, setimg] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("https://chatbackendnew-1.onrender.com/api/notification", {
          headers: { Authorization: `${sessionStorage.getItem('token')}` }
        });
        setNotifications(response.data);
        console.log(response);
        
        const setimages=response.data.map((item)=>item.image)
        console.log(setimages);
        
       // Step 1: Extract all image strings
       const images = response.data
       .map(item => item.image) // extract image
       .filter(Boolean); // remove null/undefined if any

     // Step 2: Save to img state
     setimg(images); 
      } catch (err) {
        setError('Error fetching notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);
console.log(notifications);
console.log(img);

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p>{error}</p>;

  // Assuming current user ID is stored in session storage
  const currentUserId = sessionStorage.getItem("userid");

  // Filter notifications to only include those with likes from other users
  const filteredNotifications = notifications.filter(notification => 
    notification.likes.some(like => like.user !== currentUserId)
  );
 //filteredNotifications);
  
console.log(notifications);

  return (
  <div className="bg-white min-h-screen flex justify-center">
  <div className="w-full max-w-md p-4">
    
    {/* Header */}
    <h3 className="text-xl font-bold mb-6 text-gray-800">
      Notifications
    </h3>

    {/* Empty State */}
    {filteredNotifications.length === 0 ? (
      <div className="text-center text-gray-500 mt-10">
        No notifications yet
      </div>
    ) : (
      <ul className="space-y-4">
        {filteredNotifications.map((notification) => (
          <li
            key={notification._id}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition"
          >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-3 flex-1">
              
              {/* 👥 Multiple Users Avatar Stack */}
              <div className="flex -space-x-2">
                {notification.likes.slice(0, 3).map((user, index) => (
                  user.user.profilePicture ? (
                    <img
                      key={index}
                      src={user.user.profilePicture}
                      alt={user.user.username}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white"
                    >
                      {user.user.username?.charAt(0).toUpperCase()}
                    </div>
                  )
                ))}
              </div>

              {/* TEXT */}
              <div className="text-sm">
                <span className="font-semibold text-gray-800">
                  {notification.likes[0]?.user.username || "Someone"}
                </span>

                <span className="text-gray-600 ml-1">
                  {notification.likes?.length > 1
                    ? `and ${notification.likes.length - 1} others `
                    : " "}

                  {notification.likes?.length > 0 && notification.comments?.length > 0
                    ? "liked and commented on your post"
                    : notification.likes?.length > 0
                    ? "liked your post"
                    : notification.comments?.length > 0
                    ? "commented on your post"
                    : "updated something"}
                </span>

                {/* TIME */}
               
              </div>
            </div>

            {/* RIGHT IMAGE */}
            {notification.image && (
              <img
                src={notification.image}
                alt="post"
                className="w-14 h-14 object-cover rounded-lg ml-3"
              />
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
</div>
  );
};

export default Notifications;
