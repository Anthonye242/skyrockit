const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
// we will build out our router logic here

router.get('/new', async (req, res) => {
    res.render('applications/new.ejs');
});

router.get('/', async (req, res) => {
    try {
    const currentUser = await User.findById(req.session.user._id);
      res.render('applications/index.ejs', {
        applications: currentUser.applications,
      });
    } catch (error) {
      console.log(error)
      res.redirect('/')
    }
});

router.post('/', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Push req.body (the new form data object) to the
      // applications array of the current user
      currentUser.applications.push(req.body);
      // Save changes to the user
      await currentUser.save();
      // Redirect back to the applications index view
      res.redirect(`/users/${currentUser._id}/applications`);
    } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error);
      res.redirect('/')
    }
});

router.get('/:applicationId', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Find the application by the applicationId supplied from req.params
      const application = currentUser.applications.id(req.params.applicationId);
      // Render the show view, passing the application data in the context object
      res.render('applications/show.ejs', {
        application: application,
      });
    } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error);
      res.redirect('/')
    }
  });

router.delete('/:applicationId', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Use the Mongoose .deleteOne() method to delete 
      // an application using the id supplied from req.params
      currentUser.applications.id(req.params.applicationId).deleteOne();
      // Save changes to the user
      await currentUser.save();
      // Redirect back to the applications index view
      res.redirect(`/users/${currentUser._id}/applications`);
    } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error);
      res.redirect('/')
    }
});

router.get('/:applicationId/edit', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      const application = currentUser.applications.id(req.params.applicationId);
      res.render('applications/edit.ejs', {
        application: application,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/')
    }
});
module.exports = router;