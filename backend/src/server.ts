import app from "./app";

const port = process.env.PORT || 5001;

app.listen(port, () => {
  return console.log(`Server is listening at http://localhost:${port}`);
});
