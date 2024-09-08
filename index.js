const express = require("express");
const instagramRoutes = require("./routes/instagramRoute");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", instagramRoutes); // Base path for all Instagram-related routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
