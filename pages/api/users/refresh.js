import { generateAccessToken, verifyRefreshToken} from "@/utils/auth";
import JWT_REFRESH_SECRET from "@/utils/auth";


export default function handler(req, res) {
    if (req.method === 'POST') {
        

    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    try {
        // Verify the refresh token
        const decoded = verifyRefreshToken(refreshToken, JWT_REFRESH_SECRET);


        // Generate a new access token with the same payload
        const payload = { id: decoded.id, role: decoded.role };
        const token = generateAccessToken(payload);

        return res.status(200).json({"accessToken": token});
    } catch (error) {
        return res.status(401).json({ "error" : 'Invalid refresh token' });
    }

  }

    else if (req.method === 'GET') {

        const { token } = req.query;
    
        if (!token) {
            return res.status(400).json({ message: 'token is required' });
        }
    
        try {
            // Verify the refresh token
            const decoded = verifyRefreshToken(token, JWT_REFRESH_SECRET);

            if (decoded == null){
                return res.status(401).json({ "error" : 'Invalid token' });
            }
            return res.status(200).json(decoded);

        }catch (error) {
        return res.status(401).json({ "error" : 'Invalid token' });
        }
    }
    
    else {
            return res.status(405).json({ message: 'Method not allowed' });
    }
 

}