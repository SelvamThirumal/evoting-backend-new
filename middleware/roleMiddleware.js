module.exports = (...roles) => {
  return (req, res, next) => {
    // Flat panna nested arrays ellam single array-aa maaridum
    const allowedRoles = roles.flat(); 

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(`Access denied for ${req.user.role}`);
    }
    next();
  };
};