import { register,login,allEventDetails, getUserWithEvent,
    resetPassword,getUsers,updateUser,deleteUser,
    logOut,updatePassword,filterUser,sortingUser,forgetPassword} from "../controllers/user.controller.js";
import { createEvent,downloadEventDocument,updateEvent,deleteEvent,getEventByPage,
    getEventById,inviteUserToEvent,filterEvents,sortingEvents} from "../controllers/event.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";

import upload from "../utils/upload.js";

const router = Router();

// User Router
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/log-out').post(verifyJWT,logOut)
router.route('/forget-password').post(forgetPassword)
router.route('/reset-password').post(resetPassword)

router.route('/update-user').put(verifyJWT,updateUser)
router.route('/delete-user').delete(verifyJWT,deleteUser)
router.route('/update-password').put(verifyJWT,updatePassword)

router.route('/get-user-detail').get(getUsers)
router.route('/get-user-with-event').get(verifyJWT,getUserWithEvent)

//invitation and created 
router.route('/all-event-details').get(verifyJWT,allEventDetails)

//Event
router.route('/create-event').post(verifyJWT,upload.single("uploadedFile"),createEvent)
router.route('/update-event/:id').put(verifyJWT,updateEvent)
router.route('/delete-event/:id').delete(verifyJWT,deleteEvent)


router.route('/get-event/:id').get(verifyJWT,getEventById)

router.route('/get-all-event').get(getEventByPage);

//Invite User to Event
router.route('/invite-user-to-event').post(verifyJWT,inviteUserToEvent)

// router.route('/get-event-with-user').get(verifyJWT,getEventWithUser)
//Filtering
router.route('/find-event').get(filterEvents)
router.route('/filter-user').get(filterUser)

//SORTING
router.route('/sorting-event/:name').get(sortingEvents)
router.route('/sorting-user/:name').get(sortingUser)


//Download Event Document
router.route('/download-event-document/:id').get(downloadEventDocument);

// router.route('/upload').post(upload.single("file"),uploadFile)
export default router;