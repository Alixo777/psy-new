const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const meetsRoutes = require('./routes/meets');

app.use('/api/meets', meetsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});