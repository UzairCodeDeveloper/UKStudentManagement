const Session = require('../../models/Session');

// Create a new session
const createSession = async (req, res) => {
    const { session_year, start_date, end_date, status , session_id} = req.body;

    try {

        

        if (!session_year || !start_date || !end_date) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        const existingSession = await Session.findOne({ session_year });
        if (existingSession) {
            return res.status(400).json({ msg: `Session: ${session_year} already exists` });
        }

        const newSession = new Session({
            session_year,
            start_date,
            end_date,
            status: status || 'active', // Default to 'active' if not provided
        });

        await newSession.save();
        res.status(201).json({ msg: 'Session created successfully', session: newSession });
    } catch (error) {
        console.error('Error creating session:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Fetch all sessions
const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (error) {
        console.error('Error fetching sessions:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Fetch a single session by ID
const getSessionById = async (req, res) => {
    const { id } = req.params;

    try {
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error('Error fetching session:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update a session by ID
const updateSession = async (req, res) => {
    const { id } = req.params;
    const { session_year, start_date, end_date, status, is_active } = req.body;

    try {
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        session.session_year = session_year || session.session_year;
        session.start_date = start_date || session.start_date;
        session.end_date = end_date || session.end_date;
        session.status = status || session.status;
        session.is_active = is_active !== undefined ? is_active : session.is_active;

        await session.save();
        res.status(200).json({ msg: 'Session updated successfully', session });
    } catch (error) {
        console.error('Error updating session:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Delete a session by ID
const deleteSession = async (req, res) => {
    const { id } = req.params;

    try {
        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }
        session.is_active= false;
        await session.save();

        if (!session) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        res.status(200).json({ msg: 'Session deleted successfully' });
    } catch (error) {
        console.error('Error deleting session:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

module.exports = {
    createSession,
    getAllSessions,
    getSessionById,
    updateSession,
    deleteSession,
};
