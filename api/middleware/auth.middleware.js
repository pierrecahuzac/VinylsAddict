import jwt from "jsonwebtoken";

export const AuthMiddleWare = {
  checkToken: (req, res, next) => {
    const token = req.cookies.va_token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!tokenDecoded) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      req.userId = tokenDecoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  },
};
