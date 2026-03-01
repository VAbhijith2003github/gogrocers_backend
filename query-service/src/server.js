const app = require("./app");

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`✅ query-service running on port ${PORT}`);
});
