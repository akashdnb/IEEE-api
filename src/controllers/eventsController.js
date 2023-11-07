const Event = require('../models/eventModel');

const postEvent = async (req, res) => {
    try{
        const event = new Event({
            title: req.body.title,
            summary: req.body.summary,
            description: req.body.description,
            imageUrls: req.body.imageUrls,
            postedBy: req.body.postedBy,
            admin: req.admin.email
        })
        const savedEvent = await event.save();
        res.status(200).json(savedEvent);
    }catch(err){
        res.status(400).json({message: err});
    }
}

const getEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
         const events = await Event.find()
            .select('_id title summary description imageUrls date location eventDate postedBy') 
            .skip(startIndex)
            .limit(limit);
        const total = await Event.countDocuments();

        const pagination = {
            total: total
        };
        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit: limit
            };
        }

        res.status(200).json({
            events: events,
            pagination: pagination
        });
    } catch (err) {
        res.status(400).json({ message: err });
    }
}

const getEventById = async (req, res) => {
    try{
        const event = await Event.findById(req.params.id);
        res.status(200).json(event);
    }catch(err){
        res.status(400).json({message: err});
    }
}

const deleteEvent = async (req, res) => {
    try{
        const event = await Event.findByIdAndDelete(req.params.id);
        res.status(200).json(event);
    }catch(err){
        res.status(400).json({message: err});
    }
}

const updateEvent = async (req, res) => {
    try {
        const updateFields = {};
        
        if (req.body.title) {
            updateFields.title = req.body.title;
        }

        if (req.body.summary) {
            updateFields.summary = req.body.summary;
        }

        if (req.body.description) {
            updateFields.description = req.body.description;
        }

        if(req.body.location){
            updateFields.location = req.body.location;
        }

        if(req.body.postedBy){
            updateFields.postedBy = req.body.postedBy;
        }

        updateFields.admin = req.admin.email;

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateFields, { new: true });

        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


module.exports = {
    postEvent,
    getEvents,
    getEventById,
    deleteEvent,
    updateEvent
}