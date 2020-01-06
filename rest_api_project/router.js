const express = require('express');
const router = express.Router();
const records = require('./records');


// Creates a try and catch block for the routes, to help have DRY code
function asyncHandler(callBack){
    return async (req, res, next)=>{
      try {
        await callBack(req, res, next);
      } catch(err){
        next(err);
      }
    };
};


// Retrives all quotes 
router.get('/quotes',  asyncHandler(async(req, res) => {
    const quotes = await records.getQuotes();
    res.json(quotes)
 })
);

// Gets a quote by its id
router.get('/quotes/:id', asyncHandler( async(req, res, next) => {
    const quote = await records.getQuote(req.params.id)
    if(quote){
        res.json(quote);
    } else {
        next();
  }
 })
);

// Get a random quote by its id
router.get('/quotes/random', asyncHandler( async(req, res) => {
    const quote = await records.getRandomQuote()
    res.json(quote)
 })
)

// Create a new quote and save it to the database 
router.post('/quotes', asyncHandler( async(req, res) => {
    if(req.body.author && req.body.quote){
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });
        res.status(201).json(quote);
    } else {
        res.status(400).json({message: "Quote and author required."})
    }
  })
);

//Update a quote using its id to find the quote
router.put('/quotes/:id', asyncHandler( async(req, res, next) => {
    const quote = await records.getQuote(req.params.id);
    if(quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;

        await records.updateQuote(quote);
        res.status(204).end();
    } else {
        next()
    }
  })
);

// Delete a quote using its id to find the quote
router.delete('/quotes/:id', asyncHandler( async(req, res, next) => {
    const quote = await records.getQuote(req.params.id);
    if(quote){
        await records.deleteQuote(quote);
        res.status(204).end();
    } else {
       next()
    }
  })
);

module.exports = router;