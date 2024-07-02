
const adminMiddleware = async (req, res, next) => { 
    try {
        const isAdmin = req.user.admin;
        // console.log(isAdmin)
        if (!isAdmin) {
            return res.status(400).send({ success: false, message: "User is not admin" });
        }
        next();
    } catch (error) {
        console.log(error)
    }
};

module.exports = adminMiddleware;