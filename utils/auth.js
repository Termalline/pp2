import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const BCRYPT_SALT_ROUNDS = 10
const JWT_ACCESS_SECRET = "gtyfvtyftdtguy7yughbj"
const JWT_ACCESS_EXPIRES_IN = "1h"
const JWT_REFRESH_SECRET = "gtyfvtyftdtguy7yughbj"
const JWT_REFRESH_EXPIRES_IN = "1d"


export async function hashPassword(password) {
    return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  }


export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

export function generateAccessToken(obj) {
    return jwt.sign(obj, JWT_ACCESS_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });
}

export function generateRefreshToken(obj) {
    return jwt.sign(obj, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
}

/*
export function verifyToken(token) {
    if (!token?.startsWith("Bearer ")) {
      return null;
    }
  
    token = token.split(" ")[1];
  
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (err) {
      return null;
    }
}
*/

export function verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  }

export function getUserId(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (err) {
      return null;
    }
  } 

export function verifyToken(handler) {
    return (req, res) => {

      var token = req.headers['authorization'];
      
  
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided'});
      }

      
      if (!token?.startsWith("Bearer ")) {
        return res.status(401).json("null");
      }

      token = token.split(" ")[1];

      try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        req.user = decoded;

        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }

      
    };
  }



  export function verifyAdmin(handler) {
    return (req, res) => {

      var token = req.headers['authorization'];
  
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided'});
      }

      
      if (!token?.startsWith("Bearer ")) {
        return res.status(401).json("null");
      }

      token = token.split(" ")[1];

      try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        req.user = decoded;
        
        if (req.user.role !== 'ADMIN') {
          return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
        }

        return handler(req, res);
      } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }

      
    };
  }