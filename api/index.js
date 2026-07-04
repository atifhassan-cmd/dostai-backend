module.exports = (req, res) => {
  res.status(200).json({ status: 'ok', message: 'DostAI backend is running on Vercel.' });
};
