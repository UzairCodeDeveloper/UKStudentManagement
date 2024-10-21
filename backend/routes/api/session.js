const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth')


const {
    createSession,
    getAllSessions,
    getSessionById,
    updateSession,
    deleteSession
} = require('../../controller/SessionController/SessionController');

// POST: Create a new session
router.post('/',adminAuth, createSession);

// GET: Fetch all sessions
router.get('/get-sessions',adminAuth, getAllSessions);

// GET: Fetch a session by ID
router.get('/get-session/:id',adminAuth, getSessionById);

// PUT: Update a session by ID
router.put('/edit-session/:id',adminAuth, updateSession);

// DELETE: Delete a session by ID
router.delete('/delete/:id',adminAuth, deleteSession);

module.exports = router;
