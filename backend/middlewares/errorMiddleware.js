//backend/middlewares/errorMiddleware.js
//(immigrate-forward-dev)

module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
};
