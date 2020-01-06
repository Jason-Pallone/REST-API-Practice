const express = require('express');
const app = express();
const routes = require('./router');

app.use(express.json());
app.use('/api', routes)

app.use((req, res, next) => {
    const err = new Error("Quote not found");
    err.status= 404;
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: err.message
      }
    });
})

app.listen(3000, () => console.log('Quote API listening on port 3000!'));
