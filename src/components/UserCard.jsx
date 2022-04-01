import React, { useEffect, useState } from "react";
import axios from "axios";
import SingleUserCard from "./SingleUserCard";

const UserCard = ({ friend, forceUpdate }) => {

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sinzi.herokuapp.com/api/users?userId=${friend}`
      );
      setUser(res.data);
    };
    fetchUser();
  }, [friend]);

  return (
            <>
              <SingleUserCard
                followings={user?._id}
                forceUpdate={forceUpdate}
              />
            </>
  );
};

export default UserCard;
