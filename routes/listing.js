const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedin,isOwner,validateListing} = require("../middleware.js");
const listingsController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

router
    .route("/")
    .get(wrapAsync(listingsController.index))
    .post(isLoggedin,upload.single('listing[img]'),validateListing,wrapAsync(listingsController.createListing)
);

router.get("/new",isLoggedin,listingsController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingsController.showListing))
    .put(isLoggedin,isOwner,upload.single('listing[img]'),
    validateListing,wrapAsync(listingsController.updateListing))
    .delete(isLoggedin,isOwner,
    wrapAsync(listingsController.destroyListing)
);

//Edit route
router.get("/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingsController.renderEditForm)
);

module.exports=router;