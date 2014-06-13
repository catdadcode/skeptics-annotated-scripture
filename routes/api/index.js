var router = require('express').Router();

// Get all scripture tomes from the db.
router.get('/tomes', require('./tomes'));

// Get all books in the specified tome.
router.get('/:tomeName/books', require('./books'));

// Get all chapters in the specified tome & book.
router.get('/:tomeName/:bookName/chapters', require('./chapters')); 

// Get all categories.
router.get('/categories', require('./categories'));

// Get the specified category.
router.get('/category/:categoryName', require('./category'));

// Get the specified verse or verses.
router.get('/:tomeName/:bookName?/:verseSyntax?', require('./verses'));

module.exports = router;
