import User from "../controllers/users-controller.js";

export default async function refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const id = await tokens.refresh.check(refreshToken);
      await tokens.refresh.expiration(refreshToken);
      req.user = await User.getUserById(id);
      return next();
    } catch (erro) {
      if (erro.name === "InvalidArgumentError") {
        return res.status(401).json({ erro: erro.message });
      }
      return res.status(500).json({ erro: erro.message });
    }
  }