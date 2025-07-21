const users = [];

export function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  return user;
}

export function getUser(id) {
  const user = users.find((user) => user.id === id);

  if (user) {
    return user;
  } else {
    return { message: "Could not find user" };
  }
}

export function userLeave(id) {
  const index = users.filter((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

export function getRoomUsers(room) {
  return users.filter((user) => {
    user.room === room;
  });
}
