const { users } = require('./users');

const handleAuth = (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (!user)
    return res.status(404).json({ err: true, message: 'User not found' });
  if (user.password !== password)
    return res.status(401).json({ err: true, message: 'Invalid credentials' });
  res
    .status(200)
    .json({ id: user.id, fullname: user.fullname, role: user.role });
};

module.exports = { auth: handleAuth };
